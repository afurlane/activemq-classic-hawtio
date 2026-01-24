import { log } from '../globals'

type CacheKey = string

interface CacheEntry<T> {
  value: T
  expiresAt: number
  refreshing: boolean
}

export class Cache {
  private store = new Map<CacheKey, CacheEntry<any>>()
  private inFlight = new Map<CacheKey, Promise<any>>()

  constructor(private defaultTtlMs: number = 10000) {}

  private now() {
    return Date.now()
  }

  private makeKey(parts: unknown[]): CacheKey {
    return parts.map(p => String(p)).join('|')
  }

  // API SWR
  async getOrRefresh<T>(
    fetchFn: () => Promise<T>,
    ttlMs: number = this.defaultTtlMs,
    ...keyParts: unknown[]
  ): Promise<T> {
    const key = this.makeKey(keyParts)
    const entry = this.store.get(key)
    const now = this.now()

    if (entry) {
      if (entry.expiresAt < now) {
        log.debug(`[CACHE] STALE HIT ${key}`)
        if (!entry.refreshing) {
          this.refresh(key, fetchFn, ttlMs)
        }
      } else {
        log.debug(`[CACHE] HIT ${key}`)
      }
      return entry.value
    }

    log.debug(`[CACHE] MISS ${key}`)
    return this.refresh(key, fetchFn, ttlMs)
  }

  private async refresh<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlMs: number
  ): Promise<T> {
    if (this.inFlight.has(key)) {
      log.debug(`[CACHE] JOIN IN-FLIGHT ${key}`)
      return this.inFlight.get(key)!
    }

    log.debug(`[CACHE] REFRESH ${key}`)

    const p = (async () => {
      try {
        const value = await fetchFn()
        this.store.set(key, {
          value,
          expiresAt: this.now() + ttlMs,
          refreshing: false,
        })
        return value
      } catch (err) {
        log.warn(`[CACHE] REFRESH FAILED ${key}`, err)
        const existing = this.store.get(key)
        if (existing) {
          log.debug(`[CACHE] FALLBACK TO STALE ${key}`)
          return existing.value
        }
        throw err
      } finally {
        this.inFlight.delete(key)
      }
    })()

    this.inFlight.set(key, p)
    return p
  }

  // API sincrona per BrokerRegistry
  get<T>(...keyParts: unknown[]): T | undefined {
    const key = this.makeKey(keyParts)
    const entry = this.store.get(key)
    if (!entry) return undefined
    if (entry.expiresAt < this.now()) return undefined
    return entry.value as T
  }

  set<T>(value: T, ttlMs?: number, ...keyParts: unknown[]): void {
    const key = this.makeKey(keyParts)
    const expiresAt = this.now() + (ttlMs ?? this.defaultTtlMs)
    this.store.set(key, { value, expiresAt, refreshing: false })
  }

  clear(): void {
    this.store.clear()
    this.inFlight.clear()
    log.debug('[CACHE] CLEARED')
  }
}

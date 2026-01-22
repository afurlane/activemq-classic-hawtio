type CacheKey = string

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export class Cache {
  private store = new Map<CacheKey, CacheEntry<unknown>>()

  constructor(private defaultTtlMs: number = 5000) {}

  private now() {
    return Date.now()
  }

  private makeKey(parts: unknown[]): CacheKey {
    return parts.map(p => String(p)).join('|')
  }

  get<T>(...keyParts: unknown[]): T | undefined {
    const key = this.makeKey(keyParts)
    const entry = this.store.get(key)
    if (!entry) return undefined
    if (entry.expiresAt < this.now()) {
      this.store.delete(key)
      return undefined
    }
    return entry.value as T
  }

  set<T>(value: T, ttlMs?: number, ...keyParts: unknown[]): void {
    const key = this.makeKey(keyParts)
    const expiresAt = this.now() + (ttlMs ?? this.defaultTtlMs)
    this.store.set(key, { value, expiresAt })
  }

  clear(): void {
    this.store.clear()
  }
}

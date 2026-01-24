export function createPolling<T extends (...args: any[]) => Promise<any>>(fn: T) {
  let running = false

  return async (...args: Parameters<T>): Promise<ReturnType<T> | void> => {
    if (running) return
    running = true
    try {
      return await fn(...args)
    } finally {
      running = false
    }
  }
}

import { useEffect, useState } from 'react'
import { useBrokerThroughput } from './useBrokerThroughput'

export function useBrokerThroughputRates(brokerName: string | null) {
  const { data: totals } = useBrokerThroughput(brokerName)

  const [history, setHistory] = useState<
    { enqueue: number; dequeue: number; dispatch: number }[]
  >([])

  const [rates, setRates] = useState({
    enqueue: 0,
    dequeue: 0,
    dispatch: 0,
  })

  useEffect(() => {
    if (!totals) return

    setHistory(prev => {
      const next = [...prev, totals].slice(-2)

      if (next.length === 2) {
        const prev = next[0]!
        const curr = next[1]!
        const dt = 5

        setRates({
          enqueue: (curr.enqueue - prev.enqueue) / dt,
          dequeue: (curr.dequeue - prev.dequeue) / dt,
          dispatch: (curr.dispatch - prev.dispatch) / dt,
        })
      }

      return next
    })
  }, [totals])

  return rates
}

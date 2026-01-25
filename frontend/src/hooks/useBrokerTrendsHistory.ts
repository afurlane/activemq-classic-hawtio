import { useEffect, useState } from 'react'
import { useBrokerTrendsSnapshot } from './useBrokerTrendsSnapshot'

export function useBrokerTrendsHistory(brokerName: string | null) {
  const { data: snap } = useBrokerTrendsSnapshot(brokerName)

  const [history, setHistory] = useState({
    totalSize: [] as number[],
    totalInflight: [] as number[],
    totalLag: [] as number[],
  })

  useEffect(() => {
    if (!snap) return

    setHistory(prev => ({
      totalSize: [...prev.totalSize, snap.totalSize].slice(-50),
      totalInflight: [...prev.totalInflight, snap.totalInflight].slice(-50),
      totalLag: [...prev.totalLag, snap.totalLag].slice(-50),
    }))
  }, [snap])

  return { history, latest: snap }
}

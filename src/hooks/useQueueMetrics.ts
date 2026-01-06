import { useEffect, useState } from 'react';
import { ActiveMQQueueAttributes } from '../types/activemq';
import { activemq } from '../services/activemq';

export interface QueueMetrics {
  latest: ActiveMQQueueAttributes | null;
  history: ActiveMQQueueAttributes[];
  loading: boolean;
}

export function useQueueMetrics(mbean: string, intervalMs: number = 2000): QueueMetrics {
  const [latest, setLatest] = useState<ActiveMQQueueAttributes | null>(null);
  const [history, setHistory] = useState<ActiveMQQueueAttributes[]>([]);
  const [loading, setLoading] = useState(true);

  const poll = async () => {
    const attrs = await activemq.getQueueAttributes(mbean);

    setLatest(attrs);

    setHistory(prev => {
      const next = [...prev, attrs];
      return next.slice(-120); // ultimi 120 punti (4 minuti)
    });

    setLoading(false);
  };

  useEffect(() => {
    setLatest(null);
    setHistory([]);
    setLoading(true);

    poll();
    const id = setInterval(poll, intervalMs);
    return () => clearInterval(id);
  }, [mbean, intervalMs]);

  return { latest, history, loading };
}

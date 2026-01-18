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
    if (!mbean) return;

    const attrs = await activemq.getQueueAttributes(mbean);
    if (!attrs) return;

    setLatest(attrs);

    setHistory(prev => {
      const next = [...prev, attrs];
      return next.slice(-120);
    });

    setLoading(false);
  };

  useEffect(() => {
    setLatest(null);
    setHistory([]);
    setLoading(true);

    if (mbean) poll(); // <── FIX 3: evita poll iniziale senza mbean

    const id = setInterval(() => {
      if (mbean) poll();
    }, intervalMs);

    return () => clearInterval(id);
  }, [mbean, intervalMs]);

  return { latest, history, loading };
}

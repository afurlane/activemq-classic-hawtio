import React from 'react'
import { useBrokerContext } from '../../context/BrokerContext'

export const BrokerSelector: React.FC = () => {
  const { brokers, selectedBroker, setSelectedBroker } = useBrokerContext()

  if (brokers.length === 0) {
    return <span>Nessun broker rilevato</span>
  }

  return (
    <select
      value={selectedBroker?.name ?? ''}
      onChange={e => {
        const broker = brokers.find(b => b.name === e.target.value) ?? null
        setSelectedBroker(broker)
      }}
    >
      {brokers.map(b => (
        <option key={b.mbean} value={b.name}>
          {b.name}
        </option>
      ))}
    </select>
  )
}

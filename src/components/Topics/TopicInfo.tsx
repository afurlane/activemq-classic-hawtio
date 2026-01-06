import React from 'react';

export const TopicInfo: React.FC<{ attrs: any }> = ({ attrs }) => (
  <div className="broker-panel">
    <h4>Info</h4>
    <p><b>Producers:</b> {attrs.ProducerCount}</p>
    <p><b>Subscribers:</b> {attrs.ConsumerCount}</p>
    <p><b>Queue Size:</b> {attrs.QueueSize}</p>
    <p><b>Memory Usage:</b> {attrs.MemoryPercentUsage}%</p>
    <p><b>Store Size:</b> {attrs.StoreMessageSize}</p>
    <p><b>Temp Usage:</b> {attrs.TempUsagePercentUsage}%</p>
  </div>
);

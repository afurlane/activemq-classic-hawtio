// src/components/Connectors/ConnectorsView.tsx
import React, { useEffect, useState } from 'react';
import { activemq } from '../../services/activemq';
import './connectors.css';

export const ConnectorsView: React.FC = () => {
  const [connectors, setConnectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [connections, setConnections] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    const data = await activemq.listConnectors();
    setConnectors(data);
    setLoading(false);
  };

  const loadConnections = async (connector: any) => {
    setSelected(connector);
    const list = await activemq.listConnections(connector.mbean);
    setConnections(list);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div>Loading connectors…</div>;

  return (
    <div className="connectors">
      <h2>Connectors</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Protocol</th>
            <th>Status</th>
            <th>Connections</th>
            <th>Inbound</th>
            <th>Outbound</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {connectors.map((c, i) => (
            <tr key={i}>
              <td>{c.name}</td>
              <td>{c.protocol}</td>
              <td>
                <span className={`badge ${c.active ? 'active' : 'inactive'}`}>
                  {c.active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>{c.connectionCount}</td>
              <td>{c.inbound}</td>
              <td>{c.outbound}</td>
              <td>
                <button onClick={() => loadConnections(c)}>Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="drawer">
          <h3>Connections for {selected.name}</h3>
          <button onClick={() => setSelected(null)}>Close</button>

          <table>
            <thead>
              <tr>
                <th>Connection ID</th>
                <th>Client ID</th>
                <th>Remote Address</th>
                <th>Protocol</th>
                <th>Uptime</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {connections.map((conn, i) => (
                <tr key={i}>
                  <td>{conn.connectionId}</td>
                  <td>{conn.clientId}</td>
                  <td>{conn.remoteAddress}</td>
                  <td>{conn.protocol}</td>
                  <td>{conn.uptime}</td>
                  <td>
                    <button
                      onClick={() =>
                        activemq.dropConnection(selected.mbean, conn.connectionId)
                      }
                    >
                      Drop
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

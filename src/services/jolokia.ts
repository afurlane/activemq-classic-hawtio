// src/services/jolokia.ts
import { JolokiaRequest, JolokiaResponse } from '../types/jolokia';

const JOLOKIA_URL = '/hawtio/jolokia'; // Hawtio proxy

export class JolokiaClient {
  async request<T = any>(req: JolokiaRequest): Promise<JolokiaResponse<T>> {
    const res = await fetch(JOLOKIA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });

    if (!res.ok) {
      throw new Error(`Jolokia error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  }

  async read<T = any>(mbean: string, attribute?: string): Promise<T> {
    const req: JolokiaRequest = {
      type: 'read',
      mbean,
      attribute,
    };
    const res = await this.request<T>(req);
    return res.value;
  }

  async exec<T = any>(mbean: string, operation: string, ...args: any[]): Promise<T> {
    const req: JolokiaRequest = {
      type: 'exec',
      mbean,
      operation,
      arguments: args,
    };
    const res = await this.request<T>(req);
    return res.value;
  }

  async search(pattern: string): Promise<string[]> {
    const req: JolokiaRequest = {
      type: 'search',
      mbean: pattern,
    };
    const res = await this.request<string[]>(req);
    return res.value;
  }

  async list(path?: string): Promise<any> {
    const req: JolokiaRequest = {
      type: 'list',
      path,
    };
    const res = await this.request<any>(req);
    return res.value;
  }

  async bulk<T extends JolokiaRequest>(requests: T[]): Promise<Array<{ request: T; value: any }>> {
    const res = await fetch(JOLOKIA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requests),
    });

    if (!res.ok) {
      throw new Error(`Jolokia bulk error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  }

}

export const jolokia = new JolokiaClient();

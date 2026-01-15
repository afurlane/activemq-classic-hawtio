export type JolokiaOp = 'read' | 'write' | 'exec' | 'search' | 'list' | 'bulk';

export interface JolokiaResponse<T = any> {
  request: JolokiaRequest;
  value: T;
  status: number;
  timestamp: number;
}

export interface JolokiaBaseRequest {
  type: JolokiaOp;
}

export interface JolokiaReadRequest extends JolokiaBaseRequest {
  type: 'read';
  mbean: string; // obbligatorio
  attribute?: string;
}

export interface JolokiaExecRequest extends JolokiaBaseRequest {
  type: 'exec';
  mbean: string; // obbligatorio
  operation: string;
  arguments?: any[];
}

export interface JolokiaSearchRequest extends JolokiaBaseRequest {
  type: 'search';
  mbean: string; // pattern obbligatorio
}

export interface JolokiaListRequest extends JolokiaBaseRequest {
  type: 'list';
  path?: string;
}

export type JolokiaRequest =
  | JolokiaReadRequest
  | JolokiaExecRequest
  | JolokiaSearchRequest
  | JolokiaListRequest;

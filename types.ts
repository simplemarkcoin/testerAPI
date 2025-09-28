
import type { HttpMethod, AuthType } from './constants';

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface BearerAuthConfig {
  type: AuthType.BEARER;
  token: string;
}

export interface ApiKeyAuthConfig {
    type: AuthType.API_KEY;
    key: string;
    value: string;
    addTo: 'header' | 'query';
}

export interface BasicAuthConfig {
    type: AuthType.BASIC;
    username: string;
    password: string;
}

export interface NoAuthConfig {
  type: AuthType.NONE;
}

export type AuthConfig = NoAuthConfig | BearerAuthConfig | ApiKeyAuthConfig | BasicAuthConfig;


export interface ApiRequest {
  id: string;
  method: HttpMethod;
  url: string;
  params: KeyValuePair[];
  headers: KeyValuePair[];
  auth: AuthConfig;
  body: string;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: any;
  time: number;
  error?: boolean;
}

export type HistoryItem = ApiRequest;

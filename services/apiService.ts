
import type { ApiRequest, ApiResponse, KeyValuePair } from '../types';
import { AuthType } from '../constants';

const buildUrl = (url: string, params: KeyValuePair[]): string => {
  const urlObject = new URL(url);
  params.forEach(param => {
    if (param.key && param.enabled) {
      urlObject.searchParams.append(param.key, param.value);
    }
  });
  return urlObject.toString();
};

export const sendRequest = async (request: ApiRequest): Promise<ApiResponse> => {
  const headers = new Headers();
  request.headers.forEach(header => {
    if (header.key && header.enabled) {
      headers.append(header.key, header.value);
    }
  });

  let finalUrl = request.url;
  const finalParams = [...request.params];

  // Handle Authentication
  switch (request.auth.type) {
    case AuthType.BEARER:
      if(request.auth.token) headers.set('Authorization', `Bearer ${request.auth.token}`);
      break;
    case AuthType.BASIC:
      if(request.auth.username || request.auth.password) {
        headers.set('Authorization', `Basic ${btoa(`${request.auth.username}:${request.auth.password}`)}`);
      }
      break;
    case AuthType.API_KEY:
      if(request.auth.key && request.auth.value) {
        if (request.auth.addTo === 'header') {
          headers.set(request.auth.key, request.auth.value);
        } else { // add to query params
          finalParams.push({id: 'auth', key: request.auth.key, value: request.auth.value, enabled: true});
        }
      }
      break;
  }

  finalUrl = buildUrl(request.url, finalParams);
  
  const startTime = Date.now();
  
  const options: RequestInit = {
    method: request.method,
    headers,
    body: (request.method !== 'GET' && request.method !== 'HEAD' && request.body) ? request.body : undefined,
  };

  try {
    const response = await fetch(finalUrl, options);
    const endTime = Date.now();

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    let responseBody: any;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }

    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
      time: endTime - startTime,
    };
  } catch (error: any) {
    const endTime = Date.now();
    return {
      status: 0,
      statusText: 'Fetch Error',
      headers: {},
      body: error.message,
      time: endTime - startTime,
      error: true
    };
  }
};


export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

export const HTTP_METHOD_COLORS: { [key in HttpMethod]: string } = {
  [HttpMethod.GET]: 'text-green-400',
  [HttpMethod.POST]: 'text-yellow-400',
  [HttpMethod.PUT]: 'text-blue-400',
  [HttpMethod.PATCH]: 'text-purple-400',
  [HttpMethod.DELETE]: 'text-red-400',
  [HttpMethod.HEAD]: 'text-gray-400',
  [HttpMethod.OPTIONS]: 'text-pink-400',
};

export enum AuthType {
  NONE = 'none',
  BEARER = 'bearer',
  API_KEY = 'api_key',
  BASIC = 'basic',
}

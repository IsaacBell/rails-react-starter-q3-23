export const call = async (url: string, method: string = 'GET', data?: any = undefined, headers: any = {}) => {
  const response = await fetch(url, {
    method,
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  if (!response.ok) {
    console.error(`Failed to fetch from API at ${url}: ${response.statusText}`);
  }

  return response.json();
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const get = async (url: string, headers?: any) => call(url, 'GET', null, headers);
export const post = async (url: string, data?: any, headers?: any) => call(url, 'POST', data, headers);
export const put = async (url: string, data?: any, headers?: any) => call(url, 'PUT', data, headers);
export const del = async (url: string, data?: any, headers?: any) => call(url, 'DELETE', data, headers);
/* eslint-enable @typescript-eslint/no-explicit-any */

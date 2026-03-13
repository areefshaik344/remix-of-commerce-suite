/**
 * Mock API Client
 * Simulates network requests with configurable delay and error rates.
 * When a real backend is added, swap the implementation here.
 */

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const DEFAULT_DELAY = 300; // ms

// Simulate network delay
const delay = (ms: number = DEFAULT_DELAY): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms + Math.random() * 200));

// Request interceptors
type Interceptor = (config: Record<string, unknown>) => Record<string, unknown>;
const requestInterceptors: Interceptor[] = [];
const responseInterceptors: Array<(response: unknown) => unknown> = [];

export const apiClient = {
  interceptors: {
    request: {
      use: (fn: Interceptor) => { requestInterceptors.push(fn); },
    },
    response: {
      use: (fn: (response: unknown) => unknown) => { responseInterceptors.push(fn); },
    },
  },

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    await delay();
    let config: Record<string, unknown> = { endpoint, params, method: "GET" };
    for (const interceptor of requestInterceptors) config = interceptor(config);
    console.debug(`[API] GET ${endpoint}`, params);
    // The actual data resolution happens in specific API modules
    throw new ApiError(`No handler for GET ${endpoint}`, 404);
  },

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    await delay();
    let config: Record<string, unknown> = { endpoint, body, method: "POST" };
    for (const interceptor of requestInterceptors) config = interceptor(config);
    console.debug(`[API] POST ${endpoint}`, body);
    throw new ApiError(`No handler for POST ${endpoint}`, 404);
  },

  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    await delay();
    let config: Record<string, unknown> = { endpoint, body, method: "PUT" };
    for (const interceptor of requestInterceptors) config = interceptor(config);
    console.debug(`[API] PUT ${endpoint}`, body);
    throw new ApiError(`No handler for PUT ${endpoint}`, 404);
  },

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    await delay();
    let config: Record<string, unknown> = { endpoint, method: "DELETE" };
    for (const interceptor of requestInterceptors) config = interceptor(config);
    console.debug(`[API] DELETE ${endpoint}`);
    throw new ApiError(`No handler for DELETE ${endpoint}`, 404);
  },
};

// Helper to create successful mock responses
export function mockSuccess<T>(data: T, message: string = "Success"): ApiResponse<T> {
  return { data, status: 200, message };
}

export function mockPaginated<T>(
  items: T[],
  page: number = 1,
  pageSize: number = 12
): PaginatedResponse<T> {
  const start = (page - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
  };
}

// Simulate network delay helper for direct use
export { delay as simulateDelay };

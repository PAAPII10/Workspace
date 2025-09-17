import { ApiResponse, PaginatedResponse } from '@arvasit/types';
import { UserDto, CreateUserDto, UpdateUserDto, UserLoginDto, UserResponseDto } from '@arvasit/users';
import { ProductDto, CreateProductDto, UpdateProductDto, ProductSearchDto } from '@arvasit/products';

export interface ApiClientConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
}

export class ApiClient {
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = {
      timeout: 10000,
      ...config,
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: AbortSignal.timeout(this.config.timeout!),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // User API methods
  async getUsers(page = 1, limit = 10): Promise<PaginatedResponse<UserDto>> {
    return this.request<PaginatedResponse<UserDto>>(
      `/users?page=${page}&limit=${limit}`
    );
  }

  async getUser(id: string): Promise<ApiResponse<UserDto>> {
    return this.request<UserDto>(`/users/${id}`);
  }

  async createUser(user: CreateUserDto): Promise<ApiResponse<UserDto>> {
    return this.request<UserDto>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<ApiResponse<UserDto>> {
    return this.request<UserDto>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async loginUser(credentials: UserLoginDto): Promise<ApiResponse<UserResponseDto>> {
    return this.request<UserResponseDto>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Product API methods
  async getProducts(searchParams?: ProductSearchDto): Promise<PaginatedResponse<ProductDto>> {
    const params = new URLSearchParams();
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }
    return this.request<PaginatedResponse<ProductDto>>(`/products?${params.toString()}`);
  }

  async getProduct(id: string): Promise<ApiResponse<ProductDto>> {
    return this.request<ProductDto>(`/products/${id}`);
  }

  async createProduct(product: CreateProductDto): Promise<ApiResponse<ProductDto>> {
    return this.request<ProductDto>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, product: UpdateProductDto): Promise<ApiResponse<ProductDto>> {
    return this.request<ProductDto>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  }
}

// Factory function to create API client
export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}

// Default export
export default ApiClient;

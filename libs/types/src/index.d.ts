export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
export interface PaginationParams {
  page: number;
  limit: number;
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
}
export declare enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}
export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  stockCount: number;
}
export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
}
//# sourceMappingURL=index.d.ts.map

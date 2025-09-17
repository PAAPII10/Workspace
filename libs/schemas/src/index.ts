import { z } from 'zod';

// Common schemas
export const BaseEntitySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });

export const PaginationParamsSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: z.array(dataSchema).optional(),
    error: z.string().optional(),
    message: z.string().optional(),
    pagination: z.object({
      page: z.number().int().min(1),
      limit: z.number().int().min(1),
      total: z.number().int().min(0),
      totalPages: z.number().int().min(0),
    }),
  });

// User schemas
export const UserRoleSchema = z.enum(['admin', 'user', 'moderator']);

export const UserSchema = BaseEntitySchema.extend({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: UserRoleSchema,
});

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: UserRoleSchema.default('user'),
});

export const UpdateUserSchema = CreateUserSchema.partial();

// Product schemas
export const ProductSchema = BaseEntitySchema.extend({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  price: z.number().positive(),
  category: z.string().min(1).max(100),
  inStock: z.boolean().default(true),
  stockCount: z.number().int().min(0).default(0),
});

export const CreateProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  price: z.number().positive(),
  category: z.string().min(1).max(100),
  inStock: z.boolean().default(true),
  stockCount: z.number().int().min(0).default(0),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const ProductCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

// Type exports
export type BaseEntity = z.infer<typeof BaseEntitySchema>;
export type ApiResponse<T = any> = z.infer<ReturnType<typeof ApiResponseSchema>>;
export type PaginationParams = z.infer<typeof PaginationParamsSchema>;
export type PaginatedResponse<T = any> = z.infer<ReturnType<typeof PaginatedResponseSchema>>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type CreateProduct = z.infer<typeof CreateProductSchema>;
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;
export type ProductCategory = z.infer<typeof ProductCategorySchema>;

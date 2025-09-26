import { z } from 'zod';

// Product Schemas
export const ProductDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  price: z.number().positive(),
  category: z.string().min(1).max(100),
  inStock: z.boolean().default(true),
  stockCount: z.number().int().min(0).default(0),
  sku: z.string().min(1).max(50),
  tags: z.array(z.string()).default([]),
  images: z.array(z.string().url()).default([]),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export const CreateProductDtoSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  price: z.number().positive(),
  category: z.string().min(1).max(100),
  inStock: z.boolean().default(true),
  stockCount: z.number().int().min(0).default(0),
  sku: z.string().min(1).max(50),
  tags: z.array(z.string()).default([]),
  images: z.array(z.string().url()).default([]),
  isFeatured: z.boolean().default(false),
});
export const UpdateProductDtoSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  price: z.number().positive().optional(),
  category: z.string().min(1).max(100).optional(),
  inStock: z.boolean().optional(),
  stockCount: z.number().int().min(0).optional(),
  sku: z.string().min(1).max(50).optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});
export const ProductSearchDtoSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  inStock: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['name', 'price', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
// Product Constants
export const PRODUCT_CATEGORIES = {
  ELECTRONICS: 'electronics',
  CLOTHING: 'clothing',
  BOOKS: 'books',
  HOME: 'home',
  SPORTS: 'sports',
  BEAUTY: 'beauty',
  AUTOMOTIVE: 'automotive',
  TOYS: 'toys',
};
export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
  ARCHIVED: 'archived',
};
export const SORT_OPTIONS = {
  NAME: 'name',
  PRICE: 'price',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
};
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};
//# sourceMappingURL=index.js.map

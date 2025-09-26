import { z } from 'zod';

export declare const ProductDtoSchema: z.ZodObject<
  {
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodNumber;
    category: z.ZodString;
    inStock: z.ZodDefault<z.ZodBoolean>;
    stockCount: z.ZodDefault<z.ZodNumber>;
    sku: z.ZodString;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, 'many'>>;
    images: z.ZodDefault<z.ZodArray<z.ZodString, 'many'>>;
    isFeatured: z.ZodDefault<z.ZodBoolean>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  },
  'strip',
  z.ZodTypeAny,
  {
    id: string;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    price: number;
    category: string;
    inStock: boolean;
    stockCount: number;
    sku: string;
    tags: string[];
    images: string[];
    isFeatured: boolean;
    description?: string | undefined;
  },
  {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    price: number;
    category: string;
    sku: string;
    isActive?: boolean | undefined;
    description?: string | undefined;
    inStock?: boolean | undefined;
    stockCount?: number | undefined;
    tags?: string[] | undefined;
    images?: string[] | undefined;
    isFeatured?: boolean | undefined;
  }
>;
export declare const CreateProductDtoSchema: z.ZodObject<
  {
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodNumber;
    category: z.ZodString;
    inStock: z.ZodDefault<z.ZodBoolean>;
    stockCount: z.ZodDefault<z.ZodNumber>;
    sku: z.ZodString;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, 'many'>>;
    images: z.ZodDefault<z.ZodArray<z.ZodString, 'many'>>;
    isFeatured: z.ZodDefault<z.ZodBoolean>;
  },
  'strip',
  z.ZodTypeAny,
  {
    name: string;
    price: number;
    category: string;
    inStock: boolean;
    stockCount: number;
    sku: string;
    tags: string[];
    images: string[];
    isFeatured: boolean;
    description?: string | undefined;
  },
  {
    name: string;
    price: number;
    category: string;
    sku: string;
    description?: string | undefined;
    inStock?: boolean | undefined;
    stockCount?: number | undefined;
    tags?: string[] | undefined;
    images?: string[] | undefined;
    isFeatured?: boolean | undefined;
  }
>;
export declare const UpdateProductDtoSchema: z.ZodObject<
  {
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    category: z.ZodOptional<z.ZodString>;
    inStock: z.ZodOptional<z.ZodBoolean>;
    stockCount: z.ZodOptional<z.ZodNumber>;
    sku: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
    images: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
    isFeatured: z.ZodOptional<z.ZodBoolean>;
    isActive: z.ZodOptional<z.ZodBoolean>;
  },
  'strip',
  z.ZodTypeAny,
  {
    name?: string | undefined;
    isActive?: boolean | undefined;
    description?: string | undefined;
    price?: number | undefined;
    category?: string | undefined;
    inStock?: boolean | undefined;
    stockCount?: number | undefined;
    sku?: string | undefined;
    tags?: string[] | undefined;
    images?: string[] | undefined;
    isFeatured?: boolean | undefined;
  },
  {
    name?: string | undefined;
    isActive?: boolean | undefined;
    description?: string | undefined;
    price?: number | undefined;
    category?: string | undefined;
    inStock?: boolean | undefined;
    stockCount?: number | undefined;
    sku?: string | undefined;
    tags?: string[] | undefined;
    images?: string[] | undefined;
    isFeatured?: boolean | undefined;
  }
>;
export declare const ProductSearchDtoSchema: z.ZodObject<
  {
    query: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    minPrice: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    inStock: z.ZodOptional<z.ZodBoolean>;
    isFeatured: z.ZodOptional<z.ZodBoolean>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodDefault<z.ZodEnum<['name', 'price', 'createdAt', 'updatedAt']>>;
    sortOrder: z.ZodDefault<z.ZodEnum<['asc', 'desc']>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    page: number;
    limit: number;
    sortBy: 'name' | 'createdAt' | 'updatedAt' | 'price';
    sortOrder: 'asc' | 'desc';
    category?: string | undefined;
    inStock?: boolean | undefined;
    tags?: string[] | undefined;
    isFeatured?: boolean | undefined;
    query?: string | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
  },
  {
    category?: string | undefined;
    inStock?: boolean | undefined;
    tags?: string[] | undefined;
    isFeatured?: boolean | undefined;
    query?: string | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'price' | undefined;
    sortOrder?: 'asc' | 'desc' | undefined;
  }
>;
export type ProductDto = z.infer<typeof ProductDtoSchema>;
export type CreateProductDto = z.infer<typeof CreateProductDtoSchema>;
export type UpdateProductDto = z.infer<typeof UpdateProductDtoSchema>;
export type ProductSearchDto = z.infer<typeof ProductSearchDtoSchema>;
export declare const PRODUCT_CATEGORIES: {
  readonly ELECTRONICS: 'electronics';
  readonly CLOTHING: 'clothing';
  readonly BOOKS: 'books';
  readonly HOME: 'home';
  readonly SPORTS: 'sports';
  readonly BEAUTY: 'beauty';
  readonly AUTOMOTIVE: 'automotive';
  readonly TOYS: 'toys';
};
export declare const PRODUCT_STATUS: {
  readonly ACTIVE: 'active';
  readonly INACTIVE: 'inactive';
  readonly DRAFT: 'draft';
  readonly ARCHIVED: 'archived';
};
export declare const SORT_OPTIONS: {
  readonly NAME: 'name';
  readonly PRICE: 'price';
  readonly CREATED_AT: 'createdAt';
  readonly UPDATED_AT: 'updatedAt';
};
export declare const SORT_ORDER: {
  readonly ASC: 'asc';
  readonly DESC: 'desc';
};
//# sourceMappingURL=index.d.ts.map

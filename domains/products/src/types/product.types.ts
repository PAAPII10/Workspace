export interface Product {
  id: string;
  name: string;
  price: number;
  createdAt: Date;
}

export type ProductStatus = 'active' | 'inactive' | 'draft';


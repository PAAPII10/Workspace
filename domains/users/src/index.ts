import { z } from 'zod';
import { BaseEntity, UserRole } from '@arvasit/types';

// User DTOs
export interface UserDto extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: Date;
}

export interface CreateUserDto {
  email: string;
  name: string;
  role?: UserRole;
  password: string;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface UserResponseDto {
  user: UserDto;
  token: string;
  refreshToken: string;
}

// User Schemas
export const UserDtoSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['admin', 'user', 'moderator']),
  isActive: z.boolean().default(true),
  lastLoginAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserDtoSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['admin', 'user', 'moderator']).default('user'),
  password: z.string().min(8).max(100),
});

export const UpdateUserDtoSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).max(100).optional(),
  role: z.enum(['admin', 'user', 'moderator']).optional(),
  isActive: z.boolean().optional(),
});

export const UserLoginDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const UserResponseDtoSchema = z.object({
  user: UserDtoSchema,
  token: z.string(),
  refreshToken: z.string(),
});

// User Types
export type UserDto = z.infer<typeof UserDtoSchema>;
export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;
export type UserLoginDto = z.infer<typeof UserLoginDtoSchema>;
export type UserResponseDto = z.infer<typeof UserResponseDtoSchema>;

// User Constants
export const USER_ROLES = {
  ADMIN: 'admin' as const,
  USER: 'user' as const,
  MODERATOR: 'moderator' as const,
} as const;

export const USER_STATUS = {
  ACTIVE: 'active' as const,
  INACTIVE: 'inactive' as const,
  SUSPENDED: 'suspended' as const,
} as const;

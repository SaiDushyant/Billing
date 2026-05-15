export type UserRole = "ADMIN" | "CASHIER" | "INVENTORY_MANAGER" | "ACCOUNTANT";

export interface User {
  id: string;

  name: string;

  email: string;

  role: UserRole;
}

export interface AuthResponse {
  success: boolean;

  token: string;

  user: User;
}

export interface User {
  id: number;
  email: string;
  password: string;
  isAdmin: boolean; // Булевое значение вместо строки role
}

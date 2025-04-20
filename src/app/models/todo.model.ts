export interface Todo {
  id: string;
  title: string;
  createdAt: string;
  expirationDate: string;
  // expirationTime?: string;
  isFavorite: boolean;
  isDone: boolean;
}

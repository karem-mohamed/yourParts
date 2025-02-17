export interface Category {
  id: number;
  name: string;
  description: string | null;
  userId: string;
  createdAt: Date;
}

export interface CreateCategoryData {
  name: string;
  description: string | null;
}

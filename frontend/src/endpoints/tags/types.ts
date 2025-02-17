export interface Tag {
  id: number;
  name: string;
  userId: string;
  createdAt: Date;
}

export interface CreateTagData {
  name: string;
}

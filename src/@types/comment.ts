import { User } from "./user";

export type Comment = {
  id: number; // Assuming there's an implicit primary key `id`
  post_id: number;
  user_id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
  user: User;
  liked: boolean;
  total_likes: number;
};

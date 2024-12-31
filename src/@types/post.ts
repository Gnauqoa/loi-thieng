export type Post = {
  id: string; // Assuming `id` is present as a primary key in your table
  title: string;
  content: string;
  category_id?: number | null; // Optional field, can be null
  author_id: number;
  publish_date?: Date | null; // Optional field, can be null
  created_at: Date;
  updated_at: Date;
  total_comments: number;
  is_liked: boolean;
};

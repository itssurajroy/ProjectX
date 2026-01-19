
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown or HTML
  authorId: string;
  authorName: string;
  status: 'draft' | 'published';
  tags?: string[];
  featuredImage?: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

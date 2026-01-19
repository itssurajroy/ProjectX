
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown or HTML
  excerpt?: string;
  authorId: string;
  authorName: string;
  status: 'draft' | 'published' | 'archived';
  tags?: string[];
  featuredImage?: string;
  metaDescription?: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

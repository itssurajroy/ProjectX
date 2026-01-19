export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown or HTML
  status: 'draft' | 'published';
  metaDescription?: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

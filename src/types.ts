export type Category = 'frontend' | 'backend' | 'devops' | 'database' | 'security' | 'performance' | 'architecture';

export interface Submission {
  id: string;
  title: string;
  description: string;
  codeSnippet: string; // Now supports markdown
  category: Category;
  tags: string[];
  author: string;
  votes: number;
  comments: number;
  createdAt: string;
  imageUrl?: string;
  demoUrl?: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  votes: number;
}
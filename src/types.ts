export type ToolCategory =
  | 'all'
  | '3d'
  | 'text'
  | 'social'
  | 'developer'
  | 'seo'
  | 'image'
  | 'pdf'
  | 'security'
  | 'calculator'
  | 'student'
  | 'business'
  | 'productivity'
  | 'qr'
  | 'media';

export interface ToolItem {
  id: string;
  name: string;
  shortDesc: string;
  category: ToolCategory;
  categoryLabel: string;
  iconName: string;
  tags: string[];
  popular?: boolean;
  isNew?: boolean;
}

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  iconName: string;
}

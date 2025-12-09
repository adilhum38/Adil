
export enum UserRole {
  FREELANCER = 'FREELANCER',
  CLIENT = 'CLIENT'
}

export enum City {
  ALMATY = 'Almaty',
  ASTANA = 'Astana',
  SHYMKENT = 'Shymkent',
  REMOTE = 'Remote'
}

export enum Category {
  VIDEO = 'Videography',
  SMM = 'SMM & Target',
  DESIGN = 'Design',
  DEV = 'Development',
  COPY = 'Copywriting',
  MOBILE = 'Mobileography'
}

export interface PortfolioItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  title?: string;
  likes?: number;
}

export interface Client {
  id: string;
  name: string;
  logo: string;
}

export interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  text: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar: string;
  title?: string;
  bio?: string;
  city: City;
  rating: number;
  reviewCount: number;
  skills: string[];
  hourlyRate?: number;
  portfolio: PortfolioItem[];
  clients: Client[];
  reviews: Review[];
  completedProjects: number;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  clientName: string;
  budget: number;
  currency: string;
  category: Category;
  city: City;
  postedAt: string;
  requiredSkills: string[];
  authorId?: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorUsername: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: string; // ISO date
  isLikedByCurrentUser?: boolean;
}

export interface StatData {
  name: string;
  value: number;
}

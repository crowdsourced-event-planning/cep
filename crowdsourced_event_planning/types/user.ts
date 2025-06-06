export interface User {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
  badge?: string;
  balance?: number;
  totalRating?: number;
  totalUserRating?: number;
  createdEvents?: string[];
  joinedEvents?: string[];
  createdAt?: string;
  updatedAt?: string;
  avatar?: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  badge: string;
  balance: number;
  totalRating: number;
  totalUserRating: number;
}

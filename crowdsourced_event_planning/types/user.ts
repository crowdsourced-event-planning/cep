export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  badge: string;
  balance: number;
  totalRating: number;
  totalUserRating: number;
  createdEvents: string[];
  joinedEvents: string[];
  createdAt: Date;
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

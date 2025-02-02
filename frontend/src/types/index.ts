export type User = {
  id: number;
  email: string;
  role: "user" | "admin" | "super_admin";
  name?: string;
};

export type Booking = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  userId: number;
  activityId: number;
};

export type Activity = {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  maxParticipants: number;
  imageUrl?: string;
  status: 'active' | 'inactive';
};

export type LoginResponse = {
  user: User;
  token: string;
};

export type TagTypes = 'Activity' | 'Booking' | 'Company' | 'Resource' | 'Category' | 'Package';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity extends BaseEntity {
  name: string;
  description: string;
  duration: number;
  price: number;
  maxParticipants: number;
  categoryId: string;
  companyId: string;
}

export interface Booking extends BaseEntity {
  activityId: string;
  userId: string;
  companyId: string;
  date: string;
  startTime: string;
  endTime: string;
  participants: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  activity?: Activity;
}

export interface ApiTags {
  Activity: 'Activity';
  Booking: 'Booking';
  Company: 'Company';
  Resource: 'Resource';
  Category: 'Category';
  Package: 'Package';
}

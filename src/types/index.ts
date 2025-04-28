export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  ticket_id: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_method: string;
  payment_date: string;
  created_at: string;
}

export interface Subscription {
  id: number;
  ticket_id: number;
  plan: string;
  status: 'active' | 'inactive' | 'cancelled';
  billing_cycle: 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface Ticket {
  id: number;
  ticket_number: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  customer: Customer;
  assigned_to: number | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  payments?: Payment[]; // Only visible to sales team
  subscription?: Subscription; // Only visible to sales team
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'sales' | 'tech';
}
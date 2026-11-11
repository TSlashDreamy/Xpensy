export interface ExpenseLimits {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  start_date: string;
  end_date: string;
  collection_id: string | null;
}

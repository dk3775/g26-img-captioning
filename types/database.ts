export interface UserStatistics {
  user_id: string;
  total_generations: number;
  tokens_used: number;
  tokens_remaining: number;
  account_tier: string;
  created_at: string;
  updated_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  image_url: string;
  caption: string;
  confidence_score: number;
  processing_time: number;
  tokens_used: number;
  created_at: string;
}

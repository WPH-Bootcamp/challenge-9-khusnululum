import { useQuery } from "@tanstack/react-query";
import { authGet } from "@/lib/apiAuth";

export type ReviewMenuItem = {
  menuId: number;
  menuName: string;
  price: number;
  type: "food" | "drink";
  image?: string;
  quantity: number;
};

export type ReviewItem = {
  id: number;
  star: number;
  comment: string;
  transactionId: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
  menus: ReviewMenuItem[];
};

export type ReviewResponse = {
  success: boolean;
  data: {
    reviews: ReviewItem[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export function useRestaurantReviews(
  restaurantId?: string,
  page: number = 1,
  limit: number = 10,
) {
  return useQuery({
    queryKey: ["reviews", restaurantId, page, limit],
    enabled: !!restaurantId,
    retry: false,
    queryFn: () =>
      authGet<ReviewResponse>(
        `/api/review/restaurant/${restaurantId}?page=${page}&limit=${limit}`,
      ),
  });
}

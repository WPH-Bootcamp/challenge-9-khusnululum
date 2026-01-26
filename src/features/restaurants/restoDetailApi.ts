import { useQuery } from "@tanstack/react-query";
import { authGet } from "@/lib/apiAuth";

export type MenuItem = {
  id: string;
  foodName: string;
  price: number;
  image?: string;
  type: "food" | "drink";
  category?: string;
  rating?: number;
};

export type RestaurantDetail = {
  id: string;
  name: string;
  star: number;
  place: string;
  distance: number;
  logo: string;
  images: string[];
  category: string;
  menus?: MenuItem[]; // kalau API ngirim menu
  restoName: string;
};

export type RestaurantDetailResponse = {
  success: boolean;
  data: RestaurantDetail;
};

export function useRestaurantDetail(id?: string) {
  return useQuery({
    queryKey: ["restaurant-detail", id],
    enabled: !!id,
    queryFn: () => authGet<RestaurantDetailResponse>(`/api/resto/${id}`),
  });
}

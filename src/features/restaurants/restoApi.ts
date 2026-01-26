import { useQuery } from "@tanstack/react-query";
import { authGet } from "@/lib/apiAuth";

export type Restaurant = {
  id: string;
  name: string;
  star: number;
  place: string;
  logo: string;
  images: string[];
  category: string;
  reviewCount: number;
  menuCount: number;
  priceRange: {
    min: number;
    max: number;
  };
  distance: number;
};

export type RestaurantsResponse = {
  success: boolean;
  data: {
    restaurants: Restaurant[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export function useRestaurants(params?: {
  location?: string;
  range?: number;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  category?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["restaurants", params],
    queryFn: async () => {
      const qs = new URLSearchParams();

      if (params?.location) qs.set("location", params.location);

      if (params?.range !== undefined) qs.set("range", String(params.range));
      if (params?.priceMin !== undefined)
        qs.set("priceMin", String(params.priceMin));
      if (params?.priceMax !== undefined)
        qs.set("priceMax", String(params.priceMax));
      if (params?.rating !== undefined) qs.set("rating", String(params.rating));

      if (params?.category) qs.set("category", params.category);
      if (params?.page) qs.set("page", String(params.page));
      if (params?.limit) qs.set("limit", String(params.limit));

      const query = qs.toString();
      const url = query ? `/api/resto?${query}` : "/api/resto";

      return authGet<RestaurantsResponse>(url);
    },
  });
}

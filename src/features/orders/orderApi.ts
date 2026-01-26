import { useQuery } from "@tanstack/react-query";
import { authGet } from "@/lib/apiAuth";

export type OrderStatus =
  | "preparing"
  | "on_the_way"
  | "delivered"
  | "done"
  | "canceled";

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

export type Order = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
};

export type OrdersResponse = {
  success: boolean;
  data: {
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export function useOrders(params?: {
  status?: OrderStatus;
  q?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<OrdersResponse>({
    queryKey: ["orders", params],
    queryFn: async () => {
      const qs = new URLSearchParams();

      if (params?.status) qs.set("status", params.status);
      if (params?.q) qs.set("q", params.q);
      if (params?.page) qs.set("page", String(params.page));
      if (params?.limit) qs.set("limit", String(params.limit));

      const url = qs.toString()
        ? `/api/orders?${qs.toString()}`
        : "/api/orders";

      return authGet<OrdersResponse>(url);
    },

    placeholderData: (prev) => prev,
  });
}

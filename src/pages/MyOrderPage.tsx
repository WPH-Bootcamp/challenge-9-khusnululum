import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Store, MapPin, ClipboardList, LogOut } from "lucide-react";
import { useProfile } from "@/features/auth/profileApi";
import GiveReviewModal from "@/components/orders/GiveReviewModal";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";

function rupiah(value: number) {
  return "Rp" + new Intl.NumberFormat("id-ID").format(value);
}

type OrderStatus =
  | "preparing"
  | "on_the_way"
  | "delivered"
  | "done"
  | "canceled";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

type Order = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
};

const STATUS_TABS: { key: OrderStatus; label: string }[] = [
  { key: "preparing", label: "Preparing" },
  { key: "on_the_way", label: "On the Way" },
  { key: "delivered", label: "Delivered" },
  { key: "done", label: "Done" },
  { key: "canceled", label: "Canceled" },
];

export default function MyOrdersPage() {
  const navigate = useNavigate();

  const { data: profileData, isLoading: profileLoading } = useProfile();

  const profileName = profileData?.data?.name || "User";
  const profileAvatar = profileData?.data?.avatar || "/Avatar.svg";

  const [openReview, setOpenReview] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>();
  const [selectedRestoName, setSelectedRestoName] = useState<
    string | undefined
  >();

  // dummy order dulu (nanti gampang diganti data API)
  const [orders] = useState<Order[]>([
    {
      id: "order-1",
      restaurantId: "296",
      restaurantName: "Burger King",
      status: "done",
      createdAt: "2026-01-26T10:00:00Z",
      items: [
        {
          id: "m1",
          name: "Food Name",
          price: 50000,
          qty: 2,
          image: "/AllFood.svg",
        },
      ],
    },
    {
      id: "order-2",
      restaurantId: "295",
      restaurantName: "Burger King",
      status: "done",
      createdAt: "2026-01-25T10:00:00Z",
      items: [
        {
          id: "m2",
          name: "Food Name",
          price: 50000,
          qty: 2,
          image: "/AllFood.svg",
        },
      ],
    },
  ]);

  const [q, setQ] = useState("");
  const [activeStatus, setActiveStatus] = useState<OrderStatus>("done");

  const filteredOrders = useMemo(() => {
    const keyword = q.trim().toLowerCase();

    return orders
      .filter((o) => o.status === activeStatus)
      .filter((o) => {
        if (!keyword) return true;

        const matchResto = o.restaurantName.toLowerCase().includes(keyword);
        const matchItem = o.items.some((it) =>
          it.name.toLowerCase().includes(keyword),
        );

        return matchResto || matchItem;
      });
  }, [orders, q, activeStatus]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navbar full width */}
      <div className="mx-auto w-full max-w-360">
        <Navbar variant="white" />
      </div>

      {/* WRAPPER DESKTOP */}
      <div className="mx-auto w-full max-w-360 px-4 pb-16 pt-8">
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          {/* ========================= */}
          {/* LEFT SIDEBAR (Desktop only) */}
          {/* ========================= */}
          <aside className="hidden md:block">
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-neutral-100">
              {/* Profile */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-neutral-200">
                  <img
                    src={profileAvatar}
                    alt={profileName}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-neutral-900">
                    {profileLoading ? "Loading..." : profileName}
                  </p>
                </div>
              </div>

              {/* Menu */}
              <div className="mt-4 space-y-1">
                <button
                  type="button"
                  onClick={() => navigate("/address")}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  <MapPin size={16} className="text-neutral-500" />
                  <span>Delivery Address</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/orders")}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-[#C12116] hover:bg-red-50"
                >
                  <ClipboardList size={16} className="text-[#C12116]" />
                  <span>My Orders</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert("Logout (nanti sambung auth)")}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  <LogOut size={16} className="text-neutral-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </aside>

          {/* ========================= */}
          {/* RIGHT CONTENT */}
          {/* ========================= */}
          <main>
            {/* Title */}
            <h1 className="text-xl font-extrabold text-neutral-900">
              My Orders
            </h1>

            {/* ✅ Card wrapper (seperti foto desktop) */}
            <div className="mt-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-neutral-100">
              {/* Search */}
              <div className="relative max-w-md">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search"
                  className="h-11 rounded-full bg-white pl-11 text-sm ring-1 ring-neutral-200 placeholder:text-neutral-400"
                />
              </div>

              {/* Status Tabs */}
              <div className="mt-4 flex items-center gap-3">
                <p className="text-xs font-semibold text-neutral-700">Status</p>

                <div className="flex flex-wrap gap-2">
                  {STATUS_TABS.map((tab) => {
                    const active = tab.key === activeStatus;

                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveStatus(tab.key)}
                        className={`rounded-full px-4 py-2 text-xs font-semibold ring-1 transition ${
                          active
                            ? "bg-red-50 text-[#C12116] ring-red-200"
                            : "bg-white text-neutral-700 ring-neutral-200 hover:bg-neutral-50"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* List */}
              <div className="mt-5 space-y-5">
                {filteredOrders.length === 0 ? (
                  <div className="rounded-2xl bg-neutral-50 p-6 text-center ring-1 ring-neutral-100">
                    <p className="text-sm font-medium text-neutral-700">
                      Belum ada order untuk status ini 🙂
                    </p>
                  </div>
                ) : (
                  filteredOrders.map((order) => {
                    const total = order.items.reduce(
                      (sum, it) => sum + it.qty * (it.price || 0),
                      0,
                    );

                    const firstItem = order.items[0];

                    return (
                      <div
                        key={order.id}
                        className="rounded-2xl bg-white p-4 ring-1 ring-neutral-100"
                      >
                        {/* Header resto */}
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/resto/${order.restaurantId}`)
                          }
                          className="flex w-full items-center gap-2 text-left"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
                            <Store size={16} />
                          </div>
                          <p className="text-sm font-extrabold text-neutral-900">
                            {order.restaurantName}
                          </p>
                        </button>

                        {/* Item */}
                        <div className="mt-4 flex items-center gap-3">
                          <div className="h-14 w-14 overflow-hidden rounded-2xl bg-neutral-100">
                            <img
                              src={firstItem?.image || "/placeholder-food.jpg"}
                              alt={firstItem?.name || "Food"}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="flex-1">
                            <p className="text-xs font-medium text-neutral-700">
                              {firstItem?.name || "Food Name"}
                            </p>

                            <p className="mt-1 text-xs font-extrabold text-neutral-900">
                              {firstItem?.qty || 1} x{" "}
                              {rupiah(firstItem?.price || 0)}
                            </p>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="mt-4 border-t border-neutral-200" />

                        {/* Total & Button */}
                        <div className="mt-4 flex items-end justify-between">
                          <div>
                            <p className="text-xs text-neutral-500">Total</p>
                            <p className="mt-1 text-sm font-extrabold text-neutral-900">
                              {rupiah(total)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setSelectedRestoName(order.restaurantName);
                              setOpenReview(true);
                            }}
                            className="h-10 rounded-full bg-[#C12116] px-6 text-xs font-semibold text-white hover:bg-red-800"
                          >
                            Give Review
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <GiveReviewModal
        open={openReview}
        onOpenChange={setOpenReview}
        orderId={selectedOrderId}
        restaurantName={selectedRestoName}
        onSubmit={(payload) => {
          console.log("SEND REVIEW:", payload);

          // nanti kita sambungkan ke API
          // payload = { orderId, rating, comment }
        }}
      />

      {/* ✅ Footer */}
      <div className="mx-auto w-full max-w-360">
        <Footer />
      </div>
    </div>
  );
}

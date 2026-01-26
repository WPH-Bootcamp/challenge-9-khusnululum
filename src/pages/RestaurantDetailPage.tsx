import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Share2, Minus, Plus } from "lucide-react";
import { useRestaurantReviews } from "@/features/reviews/reviewApi";

import Navbar from "@/components/layout/Navbar";
import { useRestaurantDetail } from "@/features/restaurants/restoDetailApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { addToCart, decreaseQty, increaseQty } from "@/features/cart/cartSlice";
import Footer from "@/components/layout/Footer";

function rupiah(value: number) {
  return "Rp" + new Intl.NumberFormat("id-ID").format(value);
}

export default function RestaurantDetailPage() {
  const { id } = useParams();

  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const navigate = useNavigate();
  const { data, isLoading, isError } = useRestaurantDetail(id);

  const resto = data?.data;
  const restoId = String(resto?.id ?? "");

  const images = resto?.images ?? [];
  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = useMemo(() => {
    if (!images.length) return "";
    return images[Math.min(activeIndex, images.length - 1)];
  }, [images, activeIndex]);

  const getQty = (menuId: string) => {
    const found = cartItems.find(
      (it) => it.id === String(menuId) && it.restaurantId === restoId,
    );
    return found?.qty ?? 0;
  };

  // ambil item cart khusus resto ini
  const restoCartItems = useMemo(() => {
    return cartItems.filter((it) => it.restaurantId === restoId);
  }, [cartItems, restoId]);

  const restoCartCount = useMemo(() => {
    return restoCartItems.reduce((sum, it) => sum + it.qty, 0);
  }, [restoCartItems]);

  const restoCartTotal = useMemo(() => {
    return restoCartItems.reduce(
      (sum, it) => sum + it.qty * (it.price || 0),
      0,
    );
  }, [restoCartItems]);

  const [tab, setTab] = useState<"all" | "food" | "drink">("all");
  const [visibleCount, setVisibleCount] = useState(6);

  const REVIEW_LIMIT = 5;

  const [reviewPage, setReviewPage] = useState(1);
  const [reviewList, setReviewList] = useState<any[]>([]);

  const {
    data: reviewData,
    isLoading: reviewLoading,
    isFetching: reviewFetching,
    isError: reviewError,
    error: reviewErrObj,
  } = useRestaurantReviews(String(id), reviewPage, REVIEW_LIMIT);

  const incomingReviews = Array.isArray(reviewData?.data?.reviews)
    ? reviewData.data.reviews
    : [];

  const pagination = reviewData?.data?.pagination;

  const totalPages = pagination?.totalPages ?? 1;
  const canLoadMore = reviewPage < totalPages;

  const reviews = Array.isArray(reviewData?.data?.reviews)
    ? reviewData.data.reviews
    : [];

  const reviewAvg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.star || 0), 0) / reviews.length
      : 0;

  useEffect(() => {
    if (!incomingReviews.length) return;

    setReviewList((prev) => {
      const map = new Map<number, any>();

      // masukin yang lama
      for (const r of prev) map.set(r.id, r);

      // masukin yang baru
      for (const r of incomingReviews) map.set(r.id, r);

      return Array.from(map.values());
    });
  }, [incomingReviews]);

  useEffect(() => {
    setReviewPage(1);
    setReviewList([]);
  }, [id]);

  // menus dari API
  const menus = Array.isArray(resto?.menus) ? resto.menus : [];

  const filteredMenus = useMemo(() => {
    if (tab === "all") return menus;

    return menus.filter((m) => {
      const type = String(m.type || "").toLowerCase();
      return type === tab; // tab = "food" | "drink"
    });
  }, [menus, tab]);

  // =========================
  // return condition AFTER hooks
  // =========================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-100">
        <div className="mx-auto max-w-360 px-4 py-6">Loading...</div>
      </div>
    );
  }

  if (isError || !resto) {
    return (
      <div className="min-h-screen bg-neutral-100">
        <div className="mx-auto max-w-360 px-4 py-6">
          <p className="text-sm text-red-500">Gagal load detail restaurant</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-auto max-w-360 bg-white">
      {/* TOP NAV */}
      <Navbar variant="white" />

      <div className="px-4 py-4 pb-28">
        {/* Gallery */}
        <div className="mt-2 grid gap-4 md:grid-cols-2 h-full">
          {/* LEFT BIG IMAGE */}
          <div className="overflow-hidden rounded-3xl bg-neutral-200">
            {activeImage ? (
              <img
                src={activeImage}
                alt={resto.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-neutral-300" />
            )}
          </div>

          {/* RIGHT THUMBNAILS (Desktop only) */}
          <div className="hidden grid-cols-2 gap-4 md:grid">
            {/* TOP RIGHT (big thumb) */}
            <button
              type="button"
              onClick={() => setActiveIndex(1)}
              className="col-span-2 overflow-hidden rounded-3xl bg-neutral-200"
            >
              <img
                src={images?.[1] || activeImage}
                alt="thumb-1"
                className="h-full w-full object-cover"
              />
            </button>

            {/* BOTTOM LEFT */}
            <button
              type="button"
              onClick={() => setActiveIndex(2)}
              className="overflow-hidden rounded-3xl bg-neutral-200"
            >
              <img
                src={images?.[2] || activeImage}
                alt="thumb-2"
                className="h-full w-full object-cover"
              />
            </button>

            {/* BOTTOM RIGHT */}
            <button
              type="button"
              onClick={() => setActiveIndex(3)}
              className="overflow-hidden rounded-3xl bg-neutral-200"
            >
              <img
                src={images?.[3] || activeImage}
                alt="thumb-3"
                className="h-full w-full object-cover"
              />
            </button>
          </div>
        </div>

        {/* Dots (Mobile only) */}
        <div className="mt-3 flex items-center justify-center gap-2 md:hidden">
          {images.slice(0, 4).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`h-2 w-2 rounded-full ${
                i === activeIndex ? "bg-red-600" : "bg-neutral-300"
              }`}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>

        {/* Info Card */}
        <div className="mt-4 rounded-3xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 overflow-hidden rounded-full bg-neutral-100">
              <img
                src={resto.logo}
                alt={resto.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-black">{resto.name}</p>

              <div className="mt-1 flex items-center gap-1 text-xs text-neutral-700">
                <span className="text-yellow-500">★</span>
                <span>{resto.star?.toFixed(1)}</span>
              </div>

              <p className="mt-1 text-[11px] text-neutral-500">
                {resto.place} · {resto.distance} km
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white hover:bg-neutral-50"
              aria-label="Share"
              onClick={() => {
                navigator.share?.({
                  title: resto.name,
                  text: "Check this restaurant!",
                });
              }}
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* MENU LIST */}
        <section className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-neutral-900">Menu</h2>
          </div>

          {/* Tabs */}
          <div className="mb-4 flex gap-2">
            {(["all", "food", "drink"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTab(t);
                  setVisibleCount(6); // reset biar rapi tiap pindah tab
                }}
                className={`rounded-full px-4 py-2 text-xs font-semibold ring-1 transition ${
                  tab === t
                    ? "bg-red-50 text-[#C12116] ring-red-200"
                    : "bg-white text-neutral-700 ring-neutral-200 hover:bg-neutral-50"
                }`}
              >
                {t === "all" ? "All Menu" : t === "food" ? "Food" : "Drink"}
              </button>
            ))}
          </div>

          {/* Grid Menu */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredMenus.slice(0, visibleCount).map((m) => {
              const qty = getQty(String(m.id));
              const img = m.image || "/placeholder-food.jpg";

              return (
                <div
                  key={m.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-100"
                >
                  {/* IMAGE */}
                  <div className="h-43 md:h-71 w-full bg-white">
                    <img
                      src={img}
                      alt={m.foodName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-3">
                    {/* Name */}
                    <p className="text-xs font-medium text-neutral-900 line-clamp-2">
                      {m.foodName}
                    </p>

                    {/* Price */}
                    <p className="mt-1 text-sm font-extrabold text-neutral-900">
                      {rupiah(m.price)}
                    </p>

                    {/* ACTION */}
                    {qty <= 0 ? (
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            addToCart({
                              id: String(m.id),
                              name: m.foodName,
                              price: m.price,
                              image: img,
                              restaurantId: restoId,
                              restaurantName: resto.name,
                            }),
                          )
                        }
                        className="mt-3 h-10 w-full rounded-full bg-[#C12116] text-sm font-semibold text-white hover:bg-red-800"
                      >
                        Add
                      </button>
                    ) : (
                      <div className="mt-3 flex items-center justify-between rounded-full bg-neutral-100 px-2 py-1">
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              decreaseQty({
                                id: String(m.id),
                                restaurantId: restoId,
                              }),
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-900 shadow-sm hover:bg-neutral-50"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="text-sm font-semibold text-neutral-900">
                          {qty}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              increaseQty({
                                id: String(m.id),
                                restaurantId: restoId,
                              }),
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C12116] text-white shadow-sm hover:bg-red-800"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show More */}
          {filteredMenus.length > visibleCount && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((v) => v + 6)}
                className="rounded-full border border-neutral-300 bg-white px-10 py-2 text-xs font-medium text-neutral-900 shadow-sm hover:bg-neutral-50"
              >
                Show More
              </button>
            </div>
          )}
        </section>

        {/* REVIEW SECTION */}
        <section className="mt-10 pb-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-black">Review</h2>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-yellow-500">★</span>
              <span className="font-semibold text-black">
                {reviewAvg.toFixed(1)}
              </span>
              <span className="text-xs text-neutral-500">
                ({reviewList.length} Ulasan)
              </span>
            </div>
          </div>

          {reviewLoading && (
            <p className="mt-3 text-sm text-neutral-500">Loading reviews...</p>
          )}

          {reviewError && (
            <p className="mt-3 text-sm text-red-500">
              {reviewErrObj instanceof Error
                ? reviewErrObj.message
                : "Gagal load review"}
            </p>
          )}

          {!reviewLoading && !reviewError && reviewList.length === 0 && (
            <p className="mt-3 text-sm text-neutral-500">Belum ada review.</p>
          )}

          <div className="mt-4 space-y-4">
            {reviewList.map((rv) => (
              <div
                key={rv.id}
                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-neutral-100"
              >
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 overflow-hidden rounded-full bg-neutral-200">
                    <img
                      src={rv.user?.avatar || "/Avatar.svg"}
                      alt={rv.user?.name || "User"}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-neutral-900">
                      {rv.user?.name || "User"}
                    </p>

                    <p className="text-xs text-neutral-500">
                      {new Date(rv.createdAt).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="mt-3 flex items-center gap-1 text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < rv.star ? "" : "opacity-30"}>
                      ★
                    </span>
                  ))}
                </div>

                <p className="mt-2 text-xs leading-relaxed text-black">
                  {rv.comment}
                </p>
              </div>
            ))}
          </div>

          {/* Show More */}
          {!reviewLoading && !reviewError && reviewList.length > 0 && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                disabled={!canLoadMore || reviewFetching}
                onClick={() => {
                  if (!canLoadMore) return;
                  setReviewPage((p) => p + 1);
                }}
                className={`rounded-full border px-10 py-2 text-xs font-medium shadow-sm transition ${
                  !canLoadMore
                    ? "border-neutral-200 bg-neutral-100 text-neutral-400"
                    : "border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50"
                }`}
              >
                {reviewFetching
                  ? "Loading..."
                  : canLoadMore
                    ? "Show More"
                    : "No More"}
              </button>
            </div>
          )}
        </section>

        {/* FLOATING CART BAR */}
        {restoCartCount > 0 && (
          <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-360 -translate-x-1/2 px-4 pb-4">
            <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-lg ring-1 ring-neutral-100">
              {/* Left info */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                  <span className="text-lg">🛒</span>
                  <span>{restoCartCount} Items</span>
                </div>

                <p className="text-lg font-extrabold text-neutral-900">
                  {rupiah(restoCartTotal)}
                </p>
              </div>

              {/* Button */}
              <button
                type="button"
                onClick={() => navigate(`/checkout?restoId=${restoId}`)}
                className="h-12 rounded-full bg-[#C12116] px-8 text-sm font-semibold text-white hover:bg-red-800"
              >
                Checkout
              </button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}

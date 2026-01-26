import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";

import FilterDrawer from "@/components/category/FilterDrawer";
import FilterPanelDesktop from "@/components/category/FilterPanelDesktop";
import { openFilter } from "@/features/filters/filterSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

import Navbar from "@/components/layout/Navbar";
import { useRestaurants } from "@/features/restaurants/restoApi";
import Footer from "@/components/layout/Footer";

function formatKm(value: number) {
  if (!value && value !== 0) return "";
  return `${value} km`;
}

export default function CategoryPage() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);

  const navigate = useNavigate();
  const [q] = useState("");

  // mapping distance -> range API
  const rangeKm = useMemo(() => {
    if (filters.distance === "nearby") return 1;
    if (filters.distance === "1km") return 1;
    if (filters.distance === "3km") return 3;
    if (filters.distance === "5km") return 5;
    return undefined;
  }, [filters.distance]);

  const { data, isLoading, isError, error } = useRestaurants({
    page: 1,
    limit: 20,
    category: filters.category !== "all" ? filters.category : undefined,
    rating: filters.rating ?? undefined,
    range: rangeKm,
    priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
    priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
  });

  const restaurants = Array.isArray(data?.data?.restaurants)
    ? data.data.restaurants
    : [];

  const filtered = useMemo(() => {
    if (!q.trim()) return restaurants;
    return restaurants.filter((r) =>
      r.name.toLowerCase().includes(q.toLowerCase()),
    );
  }, [restaurants, q]);

  return (
    <div className="min-h-screen mx-auto w-full max-w-360 bg-neutral-50">
      {/* Navbar full width */}
      <Navbar variant="white" />

      {/* page container */}
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6">
        {/* Title */}
        <h1 className="text-2xl font-extrabold text-neutral-900">
          All Restaurant
        </h1>

        {/* Desktop Layout: sidebar + grid */}
        <div className="mt-6 grid gap-6 md:grid-cols-[280px_1fr]">
          {/* LEFT: Filter Desktop */}
          <aside className="hidden md:block">
            <div className="sticky top-24">
              <FilterPanelDesktop />
            </div>
          </aside>

          {/* RIGHT: List */}
          <section>
            {/* Mobile filter box */}
            <div className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-neutral-100 md:hidden">
              <p className="text-sm font-bold text-neutral-900">FILTER</p>

              <button type="button" onClick={() => dispatch(openFilter())}>
                <SlidersHorizontal size={18} className="text-neutral-600" />
              </button>
            </div>

            {/* Drawer untuk mobile */}
            <FilterDrawer />

            {/* Loading / Error */}
            {isLoading && (
              <p className="mt-4 text-sm text-neutral-500">
                Loading restaurants...
              </p>
            )}

            {isError && (
              <p className="mt-4 text-sm text-red-500">
                {(error as Error).message}
              </p>
            )}

            {/* Desktop grid list */}
            {!isLoading && !isError && (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {filtered.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => navigate(`/resto/${r.id}`)}
                    className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-neutral-100 transition hover:bg-neutral-50"
                  >
                    {/* Logo */}
                    <div className="h-16 w-20 overflow-hidden rounded-2xl bg-neutral-100">
                      <img
                        src={r.logo || r.images?.[0] || ""}
                        alt={r.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-neutral-900">
                        {r.name}
                      </p>

                      <div className="mt-1 flex items-center gap-2 text-xs text-neutral-700">
                        <span className="text-yellow-500">★</span>
                        <span>{Number(r.star || 0).toFixed(1)}</span>
                      </div>

                      <p className="mt-1 text-[11px] text-neutral-500">
                        {r.place} · {formatKm(r.distance)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}

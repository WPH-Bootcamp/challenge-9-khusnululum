import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRestaurants } from "@/features/restaurants/restoApi";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";

type LocalCategoryItem = {
  key: string;
  label: string;
  icon: string; // path gambar local
  type: "route" | "filter";
  route?: string;
};

export default function HomePage() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [q, setQ] = useState("");

  const { data, isLoading, isError, error } = useRestaurants({
    page: 1,
    limit: 20,
  });

  const restaurants = Array.isArray(data?.data?.restaurants)
    ? data.data.restaurants
    : [];

  // random hero (dari API)
  const [heroRestoId, setHeroRestoId] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurants.length) return;

    const randomIndex = Math.floor(Math.random() * restaurants.length);
    setHeroRestoId(restaurants[randomIndex].id);
  }, [restaurants.length]);

  const heroResto = useMemo(() => {
    return restaurants.find((r) => r.id === heroRestoId) ?? restaurants[0];
  }, [restaurants, heroRestoId]);

  const heroImage = heroResto?.images?.[0] || heroResto?.logo || "";

  // list recommended (filter search + category API)
  const filtered = useMemo(() => {
    let list = restaurants;

    if (selectedCategory !== "all") {
      list = list.filter((r) => r.category === selectedCategory);
    }

    if (!q.trim()) return list;
    return list.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));
  }, [restaurants, selectedCategory, q]);

  const categoryItems: LocalCategoryItem[] = useMemo(
    () => [
      {
        key: "all",
        label: "All Restaurant",
        icon: "/AllFood.svg",
        type: "route",
        route: "/category",
      },
      {
        key: "nearby",
        label: "Nearby",
        icon: "/Location.svg",
        type: "route",
        route: "/category?filter=nearby",
      },
      {
        key: "discount",
        label: "Discount",
        icon: "/Discount.svg",
        type: "route",
        route: "/category?filter=discount",
      },
      {
        key: "best-seller",
        label: "Best Seller",
        icon: "/BestSeller.svg",
        type: "route",
        route: "/category?filter=best-seller",
      },
      {
        key: "delivery",
        label: "Delivery",
        icon: "/Delivery.svg",
        type: "route",
        route: "/category?filter=delivery",
      },
      {
        key: "lunch",
        label: "Lunch",
        icon: "/Lunch.svg",
        type: "route",
        route: "/category?filter=lunch",
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto w-full max-w-360 px-4 py-4">
        {/* HERO */}
        <section className="relative w-full overflow-hidden">
          <div className="relative h-105 w-full md:h-207">
            {/* background dari API */}
            {heroImage ? (
              <img
                src={heroImage}
                alt="Hero background"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-neutral-200" />
            )}

            {/* overlay */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/35 via-black/45 to-black/65" />

            {/* Navbar di atas overlay */}
            <div className="relative z-30">
              <Navbar />
            </div>

            {/* CONTENT */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
              <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl">
                Explore Culinary Experiences
              </h1>

              <p className="mt-3 max-w-130 text-xs leading-relaxed text-white/80 sm:text-sm">
                Search and refine your choice to discover the perfect
                restaurant.
              </p>

              {/* Search */}
              <div className="mt-6 w-full max-w-130">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search restaurants, food and drink"
                    className="h-11 rounded-full bg-white pl-11 pr-4 text-sm text-black placeholder:text-neutral-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY SECTION */}
        <section className="mt-6">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-5 md:px-10">
            {categoryItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  // route mode
                  if (item.type === "route" && item.route) {
                    navigate(item.route);
                    return;
                  }

                  // filter mode
                  setSelectedCategory(item.key);
                }}
                className="group flex flex-col items-center justify-center gap-3 rounded-3xl"
              >
                {/* Icon box */}
                <div className="grid w-full h-25 items-center justify-center rounded-3xl bg-white shadow-sm ring-1 ring-neutral-100 hover:bg-neutral-50">
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="h-10 w-10 object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Label */}
                <p className="text-sm font-bold text-black w-full text-center">
                  {item.label}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* RECOMMENDED */}
        <section className="mt-6 md:px-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-black">Recommended</h2>

            <button
              type="button"
              className="text-xs font-semibold text-red-500 hover:text-red-400"
              onClick={() => navigate("/category")}
            >
              See All
            </button>
          </div>

          {isLoading && (
            <p className="text-sm text-neutral-500">Loading recommended...</p>
          )}

          {isError && (
            <p className="text-sm text-red-500">{(error as Error).message}</p>
          )}

          {!isLoading && !isError && (
            <>
              <div className="space-y-3 md:grid md:grid-cols-3 md:gap-4">
                {filtered.slice(0, 6).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => navigate(`/resto/${r.id}`)}
                    className="flex w-full items-center gap-3 rounded-2xl md:mb-6 bg-white p-3 text-left shadow-sm transition hover:bg-neutral-50"
                  >
                    {/* Logo */}
                    <div className="h-20 w-20 overflow-hidden rounded-xl bg-neutral-100">
                      <img
                        src={r.logo || r.images?.[0] || ""}
                        alt={r.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-neutral-900">{r.name}</p>

                      <div className="mt-1 flex items-center gap-1 text-xs text-neutral-700">
                        <span className="text-yellow-500">★</span>
                        <span>{r.star?.toFixed(1)}</span>
                      </div>

                      <p className="mt-1 text-[11px] text-neutral-500">
                        {r.place} · {r.distance} km
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Show More */}
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  className="rounded-full border border-neutral-300 bg-white px-6 py-2 text-xs font-medium text-neutral-900 shadow-sm hover:bg-neutral-50"
                  onClick={() => navigate("/category")}
                >
                  Show More
                </button>
              </div>
            </>
          )}
        </section>

        <Footer />
      </div>
    </div>
  );
}

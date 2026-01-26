import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Store } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { decreaseQty, increaseQty } from "@/features/cart/cartSlice";

function rupiah(value: number) {
  return "Rp" + new Intl.NumberFormat("id-ID").format(value);
}

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const items = useAppSelector((state) => state.cart.items);

  // group per restaurant (unik)
  const groups = useMemo(() => {
    const map = new Map<string, typeof items>();

    for (const item of items) {
      const key = String(item.restaurantId || "unknown");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }

    return Array.from(map.entries()).map(([restoId, list]) => {
      const restoName = list[0]?.restaurantName || "Restaurant";
      const total = list.reduce((sum, it) => sum + it.qty * (it.price || 0), 0);

      return {
        restoId,
        restoName,
        items: list,
        total,
      };
    });
  }, [items]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navbar full width */}
      <div className="w-full max-w-360 mx-auto">
        <Navbar variant="white" />
      </div>

      {/* CONTENT */}
      <div className="mx-auto w-full max-w-3xl px-4 pt-8 pb-16">
        <h1 className="text-xl font-extrabold text-neutral-900 md:text-2xl">
          My Cart
        </h1>

        {/* EMPTY */}
        {items.length === 0 && (
          <div className="mt-6 max-w-xl rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-neutral-100">
            <p className="text-sm font-medium text-neutral-700">
              Keranjang kamu masih kosong
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-4 rounded-full bg-[#C12116] px-6 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Explore Menu
            </button>
          </div>
        )}

        {/* GROUP LIST */}
        {items.length > 0 && (
          <div className="mt-6 flex justify-center">
            {/* container card center seperti foto */}
            <div className="w-full max-w-3xl space-y-6">
              {groups.map((group) => (
                <div
                  key={group.restoId}
                  className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-100"
                >
                  {/* HEADER RESTO */}
                  <button
                    type="button"
                    onClick={() => navigate(`/resto/${group.restoId}`)}
                    className="flex w-full items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                        <Store size={16} />
                      </div>
                      <p className="text-sm font-bold text-neutral-900">
                        {group.restoName}
                      </p>
                    </div>

                    <span className="text-neutral-400">{">"}</span>
                  </button>

                  {/* ITEMS */}
                  <div className="mt-4 space-y-4">
                    {group.items.map((it) => (
                      <div
                        key={`${group.restoId}-${it.id}`}
                        className="flex items-center gap-3"
                      >
                        {/* Image */}
                        <div className="h-14 w-14 overflow-hidden rounded-xl bg-neutral-100">
                          <img
                            src={it.image || "/placeholder-food.jpg"}
                            alt={it.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Name + Price */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-neutral-900">
                            {it.name}
                          </p>
                          <p className="mt-1 text-xs font-extrabold text-neutral-900">
                            {rupiah(it.price)}
                          </p>
                        </div>

                        {/* Qty */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                decreaseQty({
                                  id: it.id,
                                  restaurantId: it.restaurantId,
                                }),
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                            aria-label="Decrease qty"
                          >
                            <Minus size={14} />
                          </button>

                          <p className="w-5 text-center text-sm font-semibold text-neutral-900">
                            {it.qty}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                increaseQty({
                                  id: it.id,
                                  restaurantId: it.restaurantId,
                                }),
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C12116] text-white hover:bg-red-800"
                            aria-label="Increase qty"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* TOTAL + CHECKOUT */}
                  <div className="mt-5 flex flex-col md:flex-row justify-between border-t border-neutral-200 pt-4 gap-2">
                    <div>
                      <p className="text-xs text-neutral-500">Total</p>
                      <p className="mt-1 text-sm font-extrabold text-neutral-900">
                        {rupiah(group.total)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/checkout?restoId=${group.restoId}`)
                      }
                      className="h-10 w-40 rounded-full bg-[#C12116] text-xs font-semibold text-white hover:bg-red-800"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="max-w-360 mx-auto">
        <Footer />
      </div>
    </div>
  );
}

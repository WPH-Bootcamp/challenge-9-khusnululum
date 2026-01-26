import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Minus, Plus, Store } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { decreaseQty, increaseQty } from "@/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";

function rupiah(value: number) {
  return "Rp" + new Intl.NumberFormat("id-ID").format(value);
}

type PaymentMethod = "bni" | "bri" | "bca" | "mandiri";

const paymentMethods: { key: PaymentMethod; label: string; img: string }[] = [
  { key: "bni", label: "Bank Negara Indonesia", img: "/BNI.svg" },
  { key: "bri", label: "Bank Rakyat Indonesia", img: "/BRI.svg" },
  { key: "bca", label: "Bank Central Asia", img: "/BCA.svg" },
  { key: "mandiri", label: "Mandiri", img: "/Mandiri.svg" },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [params] = useSearchParams();
  const restoId = params.get("restoId"); // dari CartPage / floating cart

  const items = useAppSelector((state) => state.cart.items);

  // filter cart berdasarkan restaurantId
  const checkoutItems = useMemo(() => {
    if (!restoId) return items;
    return items.filter((it) => String(it.restaurantId) === String(restoId));
  }, [items, restoId]);

  const restaurantName =
    checkoutItems.find((x) => x.restaurantName)?.restaurantName || "Restaurant";

  const [payment, setPayment] = useState<PaymentMethod>("bni");

  const totalItems = useMemo(() => {
    return checkoutItems.reduce((sum, it) => sum + it.qty, 0);
  }, [checkoutItems]);

  const priceTotal = useMemo(() => {
    return checkoutItems.reduce((sum, it) => sum + it.qty * (it.price || 0), 0);
  }, [checkoutItems]);

  // nanti bisa dihitung dari API / jarak
  const deliveryFee = 10000;
  const serviceFee = 1000;

  const grandTotal = priceTotal + deliveryFee + serviceFee;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navbar full width biar seperti desktop */}
      <div className="mx-auto w-full max-w-360">
        <Navbar variant="white" />
      </div>

      {/* WRAPPER (CENTER) */}
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8">
        <h1 className="text-xl font-extrabold text-neutral-900">Checkout</h1>

        {/* 2 COLUMN DESKTOP */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          {/* ===================== LEFT ===================== */}
          <div className="space-y-6">
            {/* DELIVERY ADDRESS */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-100">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl">
                  <img src="/Location.svg" alt="Location Pin" className="" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-bold text-neutral-900">
                    Delivery Address
                  </p>

                  <p className="mt-1 text-xs text-neutral-600">
                    Jl. Sudirman No. 25, Jakarta Pusat, 10220
                  </p>
                  <p className="mt-1 text-xs text-neutral-600">
                    0812-3456-7890
                  </p>

                  <button
                    type="button"
                    className="mt-3 rounded-full border border-neutral-200 bg-white px-5 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
                    onClick={() => alert("Nanti dibuat halaman change address")}
                  >
                    Change
                  </button>
                </div>
              </div>
            </section>

            {/* CART GROUP */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-100">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                    <Store size={16} />
                  </div>
                  <p className="text-sm font-bold text-neutral-900">
                    {restaurantName}
                  </p>
                </div>

                <button
                  type="button"
                  className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
                  onClick={() => {
                    if (restoId) navigate(`/resto/${restoId}`);
                    else navigate("/");
                  }}
                >
                  Add item
                </button>
              </div>

              {checkoutItems.length === 0 ? (
                <p className="text-sm text-neutral-500">Cart kosong.</p>
              ) : (
                <div className="space-y-4">
                  {checkoutItems.map((it) => (
                    <div key={it.id} className="flex items-center gap-3">
                      {/* Image */}
                      <div className="h-14 w-14 overflow-hidden rounded-xl bg-neutral-100">
                        <img
                          src={it.image || "/placeholder-food.jpg"}
                          alt={it.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
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
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
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
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C12116] text-white hover:bg-red-800"
                          aria-label="Increase qty"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ===================== RIGHT ===================== */}
          <div className="space-y-6">
            {/* PAYMENT METHOD */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-100">
              <p className="text-sm font-bold text-neutral-900">
                Payment Method
              </p>

              <div className="mt-4 space-y-2">
                {paymentMethods.map((m) => (
                  <label
                    key={m.key}
                    className="flex cursor-pointer items-center justify-between rounded-xl px-2 py-2 hover:bg-neutral-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-neutral-100">
                        <img
                          src={m.img}
                          alt={m.label}
                          className="h-full w-full object-contain p-2"
                          loading="lazy"
                        />
                      </div>

                      <p className="text-xs font-medium text-neutral-900">
                        {m.label}
                      </p>
                    </div>

                    <input
                      type="radio"
                      name="payment"
                      checked={payment === m.key}
                      onChange={() => setPayment(m.key)}
                      className="h-4 w-4 accent-red-600"
                    />
                  </label>
                ))}
              </div>
            </section>

            {/* PAYMENT SUMMARY */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-100">
              <p className="text-sm font-bold text-neutral-900">
                Payment Summary
              </p>

              <div className="mt-4 space-y-3 text-xs text-neutral-700">
                <div className="flex items-center justify-between">
                  <span>Price ({totalItems} items)</span>
                  <span className="font-semibold text-neutral-900">
                    {rupiah(priceTotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-neutral-900">
                    {rupiah(deliveryFee)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Service Fee</span>
                  <span className="font-semibold text-neutral-900">
                    {rupiah(serviceFee)}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between border-t border-neutral-200 pt-4">
                  <span className="font-semibold text-neutral-900">Total</span>
                  <span className="text-sm font-extrabold text-neutral-900">
                    {rupiah(grandTotal)}
                  </span>
                </div>
              </div>

              <Button
                className="mt-5 h-12 w-full rounded-full bg-[#C12116] text-white hover:bg-red-800"
                onClick={() => {
                  navigate("/payment-success", {
                    state: {
                      paymentMethod: payment,
                      price: priceTotal,
                      deliveryFee,
                      serviceFee,
                      total: grandTotal,
                      itemsCount: totalItems,
                      dateLabel: new Date().toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                    },
                  });
                }}
                disabled={checkoutItems.length === 0}
              >
                Buy
              </Button>
            </section>
          </div>
        </div>
      </div>

      <div className="w-full max-w-360 mx-auto">
        <Footer />
      </div>
    </div>
  );
}

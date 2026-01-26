import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

function rupiah(value: number) {
  return "Rp" + new Intl.NumberFormat("id-ID").format(value);
}

type PaymentSuccessState = {
  paymentMethod?: string;
  price?: number;
  deliveryFee?: number;
  serviceFee?: number;
  total?: number;
  itemsCount?: number;
  dateLabel?: string;
};

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state || {}) as PaymentSuccessState;

  const paymentMethod = state.paymentMethod ?? "Bank Rakyat Indonesia";
  const price = state.price ?? 100000;
  const deliveryFee = state.deliveryFee ?? 10000;
  const serviceFee = state.serviceFee ?? 1000;
  const total = state.total ?? price + deliveryFee + serviceFee;
  const itemsCount = state.itemsCount ?? 2;
  const dateLabel = state.dateLabel ?? "25 August 2025, 15:51";

  return (
    <div className="min-h-screen mx-auto w-full bg-neutral-50">
      <div className="mx-auto w-full max-w-xl px-4 pb-10 pt-40">
        <div className="flex gap-4 justify-center items-center mb-8">
          <img src="/LogoFoodyRed.svg" alt="Logo Foody" className="h-10 w-10" />
          <h1 className="text-2xl font-extrabold">Foody</h1>
        </div>

        <div className="relative mt-4 overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-neutral-100">
          {/* CUTOUT kiri kanan (efek kertas struk) */}
          <div className="pointer-events-none absolute left-0 top-40 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-50" />
          <div className="pointer-events-none absolute left-0 top-80 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-50" />
          <div className="pointer-events-none absolute right-0 top-40 h-8 w-8 translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-50" />
          <div className="pointer-events-none absolute right-0 top-80 h-8 w-8 translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-50" />

          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>

            <h1 className="mt-3 text-lg font-extrabold text-black">
              Payment Success
            </h1>

            <p className="mt-1 text-xs text-black">
              Your payment has been successfully processed.
            </p>
          </div>

          {/* Divider */}
          <div className="mt-5 border-t border-neutral-100" />

          {/* Summary */}
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs text-black">Date</p>
              <p className="text-xs font-bold text-black">{dateLabel}</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-black">Payment Method</p>
              <p className="text-xs font-bold text-black">{paymentMethod}</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-black">Price ({itemsCount} items)</p>
              <p className="text-xs font-bold text-black">{rupiah(price)}</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-black">Delivery Fee</p>
              <p className="text-xs font-bold text-black">
                {rupiah(deliveryFee)}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-black">Service Fee</p>
              <p className="text-xs font-bold text-black">
                {rupiah(serviceFee)}
              </p>
            </div>

            <div className="mt-2 border-t border-neutral-100 pt-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-black">Total</p>
                <p className="text-xs font-extrabold text-black">
                  {rupiah(total)}
                </p>
              </div>
            </div>
          </div>

          {/* Button */}
          <Button
            className="mt-6 h-12 w-full rounded-full bg-[#C12116] text-white hover:bg-red-800"
            onClick={() => navigate("/my-orders")}
          >
            See My Orders
          </Button>
        </div>
      </div>
    </div>
  );
}

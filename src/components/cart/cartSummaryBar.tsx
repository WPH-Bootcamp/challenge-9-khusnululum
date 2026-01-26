import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

export default function CartSummaryBar() {
  const navigate = useNavigate();

  const items = useAppSelector((state) => state.cart.items);

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.qty * (item.price || 0),
    0,
  );

  // kalau cart kosong, bar tidak tampil
  if (totalItems <= 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto w-full max-w-360 px-4 pb-10">
        <div className="rounded-2xl bg-white p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
          <div className="flex items-center justify-between gap-4">
            {/* Left info */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-neutral-700">
                <ShoppingBag size={18} />
                <p className="text-sm font-medium">{totalItems} Items</p>
              </div>

              <p className="mt-1 text-lg font-extrabold text-neutral-900">
                Rp{formatRupiah(totalPrice)}
              </p>
            </div>

            {/* Checkout button */}
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="h-12 flex-1 max-w-30 rounded-full bg-[#C12116] px-6 text-sm font-semibold text-white hover:bg-red-800"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

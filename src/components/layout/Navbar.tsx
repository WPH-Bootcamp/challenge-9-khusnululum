import { useEffect, useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { getToken } from "@/lib/token";
import UserMenu from "@/components/home/UserMenu";

type NavbarProps = {
  variant?: "transparent" | "white"; // default style awal
};

export default function Navbar({ variant = "transparent" }: NavbarProps) {
  const navigate = useNavigate();
  const token = getToken();
  const isLoggedIn = !!token;

  // detect scroll untuk ubah warna navbar
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 10);
    };

    handler();
    window.addEventListener("scroll", handler, { passive: true });

    return () => window.removeEventListener("scroll", handler);
  }, []);

  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.qty, 0),
  );

  // kalau sudah scroll: paksa jadi putih
  const currentVariant: "white" | "transparent" = scrolled ? "white" : variant;

  const base = useMemo(() => {
    if (currentVariant === "white") {
      return "bg-white text-black shadow-sm ring-1 ring-black/5";
    }
    return "bg-transparent text-white";
  }, [currentVariant]);

  const pill = useMemo(() => {
    if (currentVariant === "white") {
      return "bg-black/5 hover:bg-black/10";
    }
    return "bg-white/10 hover:bg-white/15 backdrop-blur";
  }, [currentVariant]);

  const logo = useMemo(() => {
    return currentVariant === "white" ? (
      <img src="/LogoFoodyRed.svg" alt="Logo Foody Red" className="h-8 w-8" />
    ) : (
      <img src="/LogoFoody.svg" alt="Logo Foody" className="h-8 w-8" />
    );
  }, [currentVariant]);

  return (
    <div className={`sticky top-0 z-50 w-full ${base}`}>
      {/* container biar max-width tetap rapi */}
      <div className="mx-auto w-full max-w-360 px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            {logo}
            <h1 className="hidden text-lg font-extrabold md:block">Foody</h1>
          </button>

          {/* Right */}
          {!isLoggedIn ? (
            // BEFORE LOGIN
            <div
              className={`flex items-center gap-2 rounded-full p-1 ${
                currentVariant === "white"
                  ? "bg-neutral-100"
                  : "bg-white/10 backdrop-blur"
              }`}
            >
              <button
                type="button"
                onClick={() => navigate("/login")}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  currentVariant === "white"
                    ? "text-black hover:bg-black/5"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                Sign in
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-neutral-100"
              >
                Sign up
              </button>
            </div>
          ) : (
            // AFTER LOGIN
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full transition ${pill}`}
                aria-label="Cart"
              >
                <ShoppingBag size={18} />

                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>

              <UserMenu />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

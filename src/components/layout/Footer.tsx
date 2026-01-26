export default function Footer() {
  return (
    <footer className="mt-10 w-full bg-neutral-950 text-white">
      <div className="flex flex-col md:flex-row justify-between mx-auto w-full max-w-360 px-6 py-10">
        <div className="max-w-md mb-10">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/15">
              <img src="/LogoFoodyRed.svg" alt="Logo Foody" />
            </div>
            <h2 className="text-2xl font-extrabold">Foody</h2>
          </div>

          <p className="mt-5 text-sm leading-8 text-white/70">
            Enjoy homemade flavors &amp; chef&apos;s signature dishes, freshly
            prepared every day. Order online or visit our nearest branch.
          </p>

          {/* Social */}
          <h3 className="mt-8 text-sm font-semibold">Follow on Social Media</h3>

          <div className="mt-4 flex items-center gap-4">
            <SocialIcon>
              <img src="/Facebook.svg" alt="Facebook" />
            </SocialIcon>
            <SocialIcon>
              <img src="/Instagram.svg" alt="Instagram" />
            </SocialIcon>
            <SocialIcon>
              <img src="/LinkedIn.svg" alt="LinkedIn" />
            </SocialIcon>
            <SocialIcon>
              <img src="/Tiktok.svg" alt="Tiktok" />
            </SocialIcon>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-10">
          <div>
            <h4 className="text-sm font-semibold">Explore</h4>
            <ul className="mt-4 space-y-4 text-sm text-white/70">
              <li className="hover:text-white cursor-pointer">All Food</li>
              <li className="hover:text-white cursor-pointer">Nearby</li>
              <li className="hover:text-white cursor-pointer">Discount</li>
              <li className="hover:text-white cursor-pointer">Best Seller</li>
              <li className="hover:text-white cursor-pointer">Delivery</li>
              <li className="hover:text-white cursor-pointer">Lunch</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Help</h4>
            <ul className="mt-4 space-y-4 text-sm text-white/70">
              <li className="hover:text-white cursor-pointer">How to Order</li>
              <li className="hover:text-white cursor-pointer">
                Payment Methods
              </li>
              <li className="hover:text-white cursor-pointer">
                Track My Order
              </li>
              <li className="hover:text-white cursor-pointer">FAQ</li>
              <li className="hover:text-white cursor-pointer">Contact Us</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition"
    >
      {children}
    </button>
  );
}

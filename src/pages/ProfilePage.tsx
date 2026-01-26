import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ClipboardList, LogOut } from "lucide-react";

import { useProfile } from "@/features/auth/profileApi";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useProfile();

  const profile = data?.data;

  const initials = useMemo(() => {
    const name = profile?.name?.trim() || "U";
    return name.slice(0, 1).toUpperCase();
  }, [profile?.name]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navbar full width */}
      <div className="mx-auto w-full max-w-360">
        <Navbar variant="white" />
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-360 px-4 pb-8 pt-8">
        {/* Desktop container */}
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          {/* LEFT SIDEBAR (Desktop only) */}
          <aside className="hidden md:block">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-neutral-100">
              {/* Profile mini */}
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-neutral-200">
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-bold text-neutral-700">
                      {initials}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-neutral-900">
                    {profile?.name || "User"}
                  </p>
                </div>
              </div>

              {/* Menu */}
              <div className="mt-5 space-y-1">
                <button
                  type="button"
                  onClick={() => navigate("/delivery-address")}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  <MapPin size={16} className="text-neutral-600" />
                  Delivery Address
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/orders")}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-xs font-semibold text-[#C12116] hover:bg-red-50"
                >
                  <ClipboardList size={16} className="text-[#C12116]" />
                  My Orders
                </button>

                <button
                  type="button"
                  onClick={() => {
                    alert("Logout (nanti disambungkan ke API)");
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  <LogOut size={16} className="text-neutral-600" />
                  Logout
                </button>
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <main>
            <h1 className="text-xl font-extrabold text-neutral-900 md:text-2xl">
              Profile
            </h1>

            {/* Loading */}
            {isLoading && (
              <div className="mt-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-neutral-100">
                <p className="text-sm text-neutral-600">Loading profile...</p>
              </div>
            )}

            {/* Error */}
            {isError && (
              <div className="mt-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-neutral-100">
                <p className="text-sm text-red-500">
                  {(error as Error)?.message || "Gagal load profile"}
                </p>
              </div>
            )}

            {/* Profile Card */}
            {!isLoading && !isError && profile && (
              <div className="mt-4 max-w-xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-neutral-100">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 overflow-hidden rounded-full bg-neutral-200">
                    <img
                      src={profile.avatar || "/Avatar.svg"}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="mt-5 space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-neutral-500">Name</p>
                    <p className="text-xs font-semibold text-neutral-900">
                      {profile.name || "-"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-neutral-500">Email</p>
                    <p className="text-xs font-semibold text-neutral-900">
                      {profile.email || "-"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-neutral-500">Nomor Handphone</p>
                    <p className="text-xs font-semibold text-neutral-900">
                      {profile.phone || "-"}
                    </p>
                  </div>
                </div>

                {/* Button */}
                <button
                  type="button"
                  onClick={() => navigate("/profile/edit")}
                  className="mt-6 h-12 w-full rounded-full bg-[#C12116] text-sm font-semibold text-white hover:bg-red-800"
                >
                  Update Profile
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <div className="mx-auto w-full max-w-360">
        <Footer />
      </div>
    </div>
  );
}

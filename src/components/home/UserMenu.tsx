import { useNavigate } from "react-router-dom";
import { LogOut, MapPin, ClipboardList } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { clearToken } from "@/lib/token";
import { useProfile } from "@/features/auth/profileApi";

export default function UserMenu() {
  const navigate = useNavigate();
  const { data } = useProfile();

  const name = data?.data?.name ?? "User";
  const avatarUrl = data?.data?.avatar; // kalau backend ngasih full url

  function handleLogout() {
    clearToken();
    navigate("/login", { replace: true });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label="User menu">
          <Avatar className="h-10 w-10 ring-2 ring-white/20">
            <AvatarImage src={avatarUrl} alt="User avatar" />
            <AvatarFallback>{name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-64 rounded-2xl border-none bg-white p-3 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarUrl} alt="User avatar" />
            <AvatarFallback>{name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
          </Avatar>

          <button onClick={() => navigate("/profile")} className="min-w-0">
            <p className="truncate text-sm font-semibold text-black">{name}</p>
          </button>
        </div>

        <DropdownMenuSeparator className="my-2 bg-neutral-200" />

        <DropdownMenuItem
          onClick={() => alert("Delivery Address (nanti)")}
          className="cursor-pointer gap-2 rounded-xl px-3 py-2 text-sm text-black focus:bg-neutral-100"
        >
          <MapPin size={16} />
          Delivery Address
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate("/my-orders")}
          className="cursor-pointer gap-2 rounded-xl px-3 py-2 text-sm text-black focus:bg-neutral-100"
        >
          <ClipboardList size={16} />
          My Orders
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-neutral-200" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer gap-2 rounded-xl px-3 py-2 text-sm text-black focus:bg-neutral-100"
        >
          <LogOut size={16} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  closeFilter,
  setDistance,
  setPriceMax,
  setPriceMin,
  setRating,
  type DistanceFilter,
} from "@/features/filters/filterSlice";

export default function FilterDrawer() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);

  if (!filters.isOpen) return null;

  const distanceOptions: { key: DistanceFilter; label: string }[] = [
    { key: "nearby", label: "Nearby" },
    { key: "1km", label: "Within 1 km" },
    { key: "3km", label: "Within 3 km" },
    { key: "5km", label: "Within 5 km" },
  ];

  return (
    <div className="fixed inset-0 z-100">
      {/* overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close filter overlay"
        onClick={() => dispatch(closeFilter())}
      />

      {/* panel */}
      <div className="absolute left-0 top-0 h-full w-[320px] bg-white shadow-xl">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-sm font-extrabold tracking-wide">FILTER</h2>

          <button
            type="button"
            onClick={() => dispatch(closeFilter())}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200"
            aria-label="Close filter"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pb-6">
          {/* Distance */}
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Distance</h3>

            <div className="mt-3 space-y-3">
              {distanceOptions.map((d) => (
                <label
                  key={d.key}
                  className="flex cursor-pointer items-center gap-3 text-sm text-neutral-700"
                >
                  <Checkbox
                    checked={filters.distance === d.key}
                    onCheckedChange={() => dispatch(setDistance(d.key))}
                  />
                  {d.label}
                </label>
              ))}
            </div>
          </div>

          <div className="my-5 h-px bg-neutral-200" />

          {/* Price */}
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Price</h3>

            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-2">
                <div className="rounded-lg bg-neutral-100 px-2 py-1 text-xs font-semibold">
                  Rp
                </div>
                <Input
                  value={filters.priceMin}
                  onChange={(e) => dispatch(setPriceMin(e.target.value))}
                  placeholder="Minimum Price"
                  className="border-0 p-0 shadow-none focus-visible:ring-0"
                  inputMode="numeric"
                />
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-2">
                <div className="rounded-lg bg-neutral-100 px-2 py-1 text-xs font-semibold">
                  Rp
                </div>
                <Input
                  value={filters.priceMax}
                  onChange={(e) => dispatch(setPriceMax(e.target.value))}
                  placeholder="Maximum Price"
                  className="border-0 p-0 shadow-none focus-visible:ring-0"
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>

          <div className="my-5 h-px bg-neutral-200" />

          {/* Rating */}
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Rating</h3>

            <div className="mt-3 space-y-3">
              {[5, 4, 3, 2, 1].map((star) => (
                <label
                  key={star}
                  className="flex cursor-pointer items-center gap-3 text-sm text-neutral-700"
                >
                  <Checkbox
                    checked={filters.rating === star}
                    onCheckedChange={() =>
                      dispatch(setRating(filters.rating === star ? null : star))
                    }
                  />
                  <span className="flex items-center gap-2">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{star}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

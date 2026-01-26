import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  setDistance,
  setPriceMin,
  setPriceMax,
  setRating,
} from "@/features/filters/filterSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

export default function FilterPanelDesktop() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);

  const isDistance = (key: string) => filters.distance === key;
  const isRating = (n: number) => Number(filters.rating || 0) === n;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-neutral-100">
      <p className="text-sm font-extrabold text-neutral-900">FILTER</p>

      {/* Distance */}
      <div className="mt-4">
        <p className="text-xs font-semibold text-neutral-900">Distance</p>

        <div className="mt-3 space-y-3 text-sm text-neutral-700">
          {[
            { key: "nearby", label: "Nearby" },
            { key: "1km", label: "Within 1 km" },
            { key: "3km", label: "Within 3 km" },
            { key: "5km", label: "Within 5 km" },
          ].map((d) => (
            <label key={d.key} className="flex items-center gap-3">
              <Checkbox
                checked={isDistance(d.key)}
                onCheckedChange={() => dispatch(setDistance(d.key as any))}
              />
              <span>{d.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="my-5 h-px w-full bg-neutral-100" />

      {/* Price */}
      <div>
        <p className="text-xs font-semibold text-neutral-900">Price</p>

        <div className="mt-3 space-y-3">
          <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2">
            <span className="text-xs text-neutral-500">Rp</span>
            <Input
              value={filters.priceMin ?? ""}
              onChange={(e) => dispatch(setPriceMin(e.target.value))}
              placeholder="Minimum Price"
              className="h-8 border-0 p-0 text-sm shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2">
            <span className="text-xs text-neutral-500">Rp</span>
            <Input
              value={filters.priceMax ?? ""}
              onChange={(e) => dispatch(setPriceMax(e.target.value))}
              placeholder="Maximum Price"
              className="h-8 border-0 p-0 text-sm shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
      </div>

      <div className="my-5 h-px w-full bg-neutral-100" />

      {/* Rating */}
      <div>
        <p className="text-xs font-semibold text-neutral-900">Rating</p>

        <div className="mt-3 space-y-3 text-sm text-neutral-700">
          {[5, 4, 3, 2, 1].map((n) => (
            <label key={n} className="flex items-center gap-3">
              <Checkbox
                checked={isRating(n)}
                onCheckedChange={() => dispatch(setRating(n))}
              />
              <span className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                {n}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

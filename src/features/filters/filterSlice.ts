import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type SortBy = "rating-desc" | "price-asc" | "price-desc";
export type DistanceFilter = "nearby" | "1km" | "3km" | "5km" | null;

type FilterState = {
  // UI drawer
  isOpen: boolean;

  // Challenge 9 requirements
  category: string;
  sortBy: SortBy;
  search: string;

  // tambahan dari UI filter figma
  distance: DistanceFilter;
  priceMin: string;
  priceMax: string;
  rating: number | null; // 1-5
};

const initialState: FilterState = {
  isOpen: false,

  category: "all",
  sortBy: "rating-desc",
  search: "",

  distance: "nearby",
  priceMin: "",
  priceMax: "",
  rating: null,
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    // drawer
    openFilter(state) {
      state.isOpen = true;
    },
    closeFilter(state) {
      state.isOpen = false;
    },
    toggleFilter(state) {
      state.isOpen = !state.isOpen;
    },

    // existing
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
    },
    setSortBy(state, action: PayloadAction<SortBy>) {
      state.sortBy = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },

    // new
    setDistance(state, action: PayloadAction<DistanceFilter>) {
      state.distance = action.payload;
    },
    setPriceMin(state, action: PayloadAction<string>) {
      state.priceMin = action.payload;
    },
    setPriceMax(state, action: PayloadAction<string>) {
      state.priceMax = action.payload;
    },
    setRating(state, action: PayloadAction<number | null>) {
      state.rating = action.payload;
    },

    resetFilters() {
      return initialState;
    },
  },
});

export const {
  openFilter,
  closeFilter,
  toggleFilter,

  setCategory,
  setSortBy,
  setSearch,

  setDistance,
  setPriceMin,
  setPriceMax,
  setRating,

  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;

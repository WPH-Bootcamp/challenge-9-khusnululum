import { useMemo, useState } from "react";
import { Star } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // optional, biar tau review order mana
  orderId?: string;
  restaurantName?: string;

  onSubmit?: (payload: {
    orderId?: string;
    rating: number;
    comment: string;
  }) => void;
};

export default function GiveReviewModal({
  open,
  onOpenChange,
  orderId,
  restaurantName,
  onSubmit,
}: Props) {
  const [rating, setRating] = useState<number>(4);
  const [comment, setComment] = useState<string>("");

  const canSend = useMemo(() => {
    return rating > 0 && comment.trim().length > 0;
  }, [rating, comment]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSend = () => {
    if (!canSend) return;

    onSubmit?.({
      orderId,
      rating,
      comment: comment.trim(),
    });

    // reset setelah send
    setComment("");
    setRating(4);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-[92vw]
          max-w-md
          rounded-3xl
          border-0
          bg-white
          p-0
          shadow-lg
        "
      >
        {/* HEADER */}
        <DialogHeader className="flex flex-row items-center justify-between px-5 pt-5">
          <DialogTitle className="text-base font-extrabold text-neutral-900">
            Give Review
          </DialogTitle>

          <DialogDescription className="sr-only">
            Form untuk memberi rating dan review pesanan.
          </DialogDescription>

          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-neutral-100"
            aria-label="Close"
          ></button>
        </DialogHeader>

        {/* BODY */}
        <div className="px-5 pb-5">
          {/* OPTIONAL INFO */}
          {(restaurantName || orderId) && (
            <p className="mt-1 text-xs text-neutral-500">
              {restaurantName ? restaurantName : "Restaurant"}{" "}
              {orderId ? `• Order ${orderId}` : ""}
            </p>
          )}

          {/* GIVE RATING */}
          <div className="mt-4">
            <p className="text-center text-sm font-bold text-neutral-900">
              Give Rating
            </p>

            <div className="mt-3 flex items-center justify-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const value = i + 1;
                const active = value <= rating;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="rounded-md p-1"
                    aria-label={`Rating ${value}`}
                  >
                    <Star
                      size={26}
                      className={
                        active ? "text-yellow-500" : "text-neutral-300"
                      }
                      fill={active ? "currentColor" : "none"}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* TEXTAREA */}
          <div className="mt-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Please share your thoughts about our service!"
              className="
                h-36
                w-full
                resize-none
                rounded-2xl
                border
                border-neutral-200
                bg-white
                p-4
                text-sm
                text-neutral-900
                outline-none
                placeholder:text-neutral-400
                focus:border-neutral-300
              "
            />
          </div>

          {/* SEND BUTTON */}
          <button
            type="button"
            disabled={!canSend}
            onClick={handleSend}
            className={`
              mt-4 h-12 w-full rounded-full text-sm font-semibold text-white transition
              ${canSend ? "bg-[#C12116] hover:bg-red-800" : "bg-neutral-300"}
            `}
          >
            Send
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

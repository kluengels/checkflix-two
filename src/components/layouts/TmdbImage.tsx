/* eslint-disable @next/next/no-img-element */

import { EnrichedActivity } from "@/types/customTypes";

interface ImdbImageProps {
  item: EnrichedActivity;
  large?: boolean;
  className?: string;
}

/**
 * Renders an image from the TMDB API or a placeholder if no image is available
 * @param large - booelan to determine if the image should be displayed in a larger size, default witdh is 342px
 * @param item - data object with the image url and title
 * @param className - optional additional className
 * @returns an image with alt text in full width
 */
export const TmdbImage = ({
  item,
  large = false,
  className,
}: ImdbImageProps) => {
  const baseUrlLarge = process.env.NEXT_PUBLIC_TMDB_IMAGE_LARGE_URL;
  const baseUrLSmall = process.env.NEXT_PUBLIC_TMDB_IMAGE_SMALL_URL;

  const itemUrl = item.image ? item.image : item.poster ? item.poster : null;

  let url = "";

  if (!large && itemUrl) {
    url = baseUrLSmall + itemUrl;
  } else if (large && itemUrl) {
    url = baseUrlLarge + itemUrl;
  } else if (!large && !itemUrl) {
    url = "https://placehold.co/500x281/black/white/jpg?text=No+image+found";
  } else {
    url = "https://placehold.co/1200x675/black/white/jpg?text=No+image+found";
  }

  return <img width="100%" src={url} alt={item.title} className={className} />;
};

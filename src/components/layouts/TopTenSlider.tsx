import { useTranslations } from "next-intl";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { TmdbImage } from "@/components/layouts/TmdbImage";
import { hoursFromSeconds } from "@/utils/transformDuration";

import { EnrichedActivity } from "@/types/customTypes";
import { getFirstAndLastYear } from "@/utils/filterDates";

interface TopTenSliderProps {
  topten: EnrichedActivity[];
}

/**
 * Renders a swiper carousel with the top 10 tv shows.
 */
export const TopTenSlider = ({ topten }: TopTenSliderProps) => {
  // get selected language
  const t = useTranslations("TopTenSlider");

  return (
    <>
      <Swiper
        modules={[Navigation, Keyboard]}
        spaceBetween={50}
        navigation
        keyboard
        slidesPerView={1}
      >
        {topten?.map((item, index) => {
          const { firstYear, lastYear } = getFirstAndLastYear(item.date);
          return (
            <SwiperSlide key={index}>
              <TmdbImage large item={item} className="w-full" />
              <div className="absolute inset-x-0 bottom-5 flex flex-col items-center gap-2 sm:bottom-20">
                <h3 className="bg-background/60 px-6 text-center font-display text-2xl text-foreground sm:text-4xl">
                  {index + 1}. {item.title}
                </h3>
                <p className="bg-background/60 px-6 text-xs text-foreground sm:text-lg">
                  {t("hours", { count: hoursFromSeconds(item.duration) })}
                  <span>
                    {" "}
                    &#040;{firstYear}
                    {firstYear !== lastYear && ` - ${lastYear}`}&#041;
                  </span>
                </p>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

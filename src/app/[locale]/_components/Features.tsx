import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  BiPieChartAlt2,
  BiMovie,
  BiTv,
  BiCalendar,
  BiLineChart,
  BiCalculator,
} from "react-icons/bi";

/**
 * responsive Features component for the homepage
 */
export default function Features({ className }: { className: string }) {
  const t = useTranslations("HomePage.Features");
  return (
    <section className={cn("item-center flex flex-col", className)}>
      <h2 className="mb-6 text-center">{t("title")}</h2>
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        {[
          { icon: BiCalculator, text: t("totaltime") },
          { icon: BiTv, text: t("shows") },
          { icon: BiPieChartAlt2, text: t("genres") },
          { icon: BiMovie, text: t("movies") },
          { icon: BiCalendar, text: t("calender") },
          { icon: BiLineChart, text: t("time") },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2">
            <Icon className="h-10 w-10 flex-shrink-0 text-secondary" />
            <span className="text-balance">{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

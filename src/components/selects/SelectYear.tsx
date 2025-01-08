import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectYearProps {
  activeYear: number | null | undefined;
  setActiveYear: Dispatch<SetStateAction<number | null | undefined>>;
  years: number[];
  chartConfig: { [key: number]: { label: string; color: string } };
  doNotRenderSelectAll?: boolean;
}

/**
 * Select a year to filter the data
 * @param activeYear - the currently selected year
 * @param setActiveYear - function to set the active year
 * @param years - all available years
 * @param chartConfig - configuration for the chart
 * @param doNotRenderSelectAll - optional flag to not render the "all years" option
 */
export default function SelectYear({
  activeYear,
  setActiveYear,
  years,
  chartConfig,
  doNotRenderSelectAll,
}: SelectYearProps) {
  const t = useTranslations("Dashboard.yearSelector");
 

  return (
    <Select
      key={"genre-select" + activeYear}
      value={activeYear ? activeYear.toString() : undefined}
      onValueChange={(value) => {
        setActiveYear(Number(value));
      }}
    >
      <SelectTrigger
        className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
        aria-label={t("selectLabel")}
      >
        <SelectValue placeholder={t("selectYear")} />
      </SelectTrigger>

      <SelectContent align="end" className="rounded-xl">
        {years.map((key) => {
          const config = chartConfig[key as keyof typeof chartConfig];
          if (!config) {
            return null;
          }
          return (
            <SelectItem
              key={key}
              value={key.toString()}
              className="rounded-lg [&_span]:flex"
            >
              <div className="flex items-center gap-2 text-xs">
                <span
                  className="flex h-3 w-3 shrink-0 rounded-sm"
                  style={{
                    backgroundColor: `var(--color-${key})`,
                  }}
                />
                {config?.label}
              </div>
            </SelectItem>
          );
        })}
        {!!activeYear && !doNotRenderSelectAll && (
          <>
            <SelectSeparator />
            <SelectItem
              key="all"
              value={undefined as never}
              className="rounded-lg"
            >
              <div className="flex items-center gap-2 text-xs">
                <span className="flex h-3 w-3 shrink-0 rounded-sm bg-transparent" />
                {t("allYears")}
              </div>
            </SelectItem>
          </>
        )}
      </SelectContent>
    </Select>
  );
}

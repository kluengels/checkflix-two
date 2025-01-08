"use client";
import { useData } from "@/context/DataProvider";
import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStorage } from "@/hooks/useStorage";

/**
 * Renders a Select to switch between users.
 */

export default function UserSelect() {
  const t = useTranslations("Dashboard.users");
  const { user, setUser } = useData();
  const { data: userlist } = useStorage("USERLIST");
  const userCount = userlist?.length || 1;

  if (!userlist) return null;

  return (
    <>
      {userCount > 1 && (
        <Select value={user} onValueChange={setUser}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("resetselection")} />
          </SelectTrigger>
          <SelectContent>
            {userlist?.map((user) => (
              <SelectItem key={user} value={user}>
                {user}
              </SelectItem>
            ))}
            <SelectSeparator />
            <SelectItem aria-label={t("resetselection")} value="all">
              {t("resetselection")}
            </SelectItem>
          </SelectContent>
        </Select>
      )}
    </>
  );
}

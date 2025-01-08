"use client";

import { Button } from "@/components/ui/button";
import { clear } from "idb-keyval";
import { useTranslations } from "next-intl";

/**
 * Button lets the user delete all data from the IndexedDB
 */
export default function DeleteDataButton({
  className,
}: {
  className?: string;
}) {
  const t = useTranslations("Upload");
  async function clearDB() {
    await clear();
    alert(t("dataDeleted"));
  }

  return (
    <Button variant="destructive" onClick={clearDB} className={className}>
      {t("deleteButton")}
    </Button>
  );
}

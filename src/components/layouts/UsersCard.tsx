"use client";

import { useTranslations } from "next-intl";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";

import UserSelect from "../selects/UserSelect";

interface UsersCardProps {
  userlist: string[];
  className?: string;
}

/**
 * Renders a card with a summary of the total number of users and a select to switch between users.
 */

export default function UsersCard({ userlist, className }: UsersCardProps) {
  const t = useTranslations("Dashboard.users");
  const userCount = userlist.length;

  return (
    <Card className={cn("grid-cols-2 sm:grid", className)}>
      <CardHeader>
        <CardTitle className="">
          <h2 className="text-6xl sm:text-7xl">
            {userlist.length}{" "}
            <span className="text-4xl">{t("title", { count: userCount })}</span>
          </h2>
        </CardTitle>
        <CardDescription>
          {t("description", { count: userCount })}
        </CardDescription>
      </CardHeader>
      {userCount > 1 && (
        <CardFooter className="sm:flex sm:justify-end">
          <UserSelect />
        </CardFooter>
      )}
    </Card>
  );
}

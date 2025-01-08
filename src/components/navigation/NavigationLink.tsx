"use client";
import { Link, Pathnames } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useSelectedLayoutSegment } from "next/navigation";
import { ComponentProps } from "react";


interface NavigationLinkProps extends ComponentProps<typeof Link> {
  variant?: "default" | "hamburger";
  href: Pathnames;
  children: React.ReactNode;
}

/**
 * Render navigation link with active state
 */
export default function NavigationLink({
  className,
  href,
  ...rest
}: NavigationLinkProps) {
  const selectedLayoutSegment = useSelectedLayoutSegment();

  const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : "/";
  const isActive = pathname === href;

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "text-nowrap px-4 py-1 text-xl font-bold md:text-base",

        { "underline underline-offset-4": isActive },

        {
          "rounded-sm hover:bg-accent": !isActive,
        },
        className,
      )}
      href={href}
      {...rest}
    />
  );
}

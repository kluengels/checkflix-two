import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
// import CookieBannerButton from './cookies/CookieBannerButton';
import { Button } from "@/components/ui/button";
import { BiHeart } from "react-icons/bi";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <div className="flex h-16 border-t bg-muted dark:bg-background">
      <div className="container mx-auto flex flex-col items-center overflow-hidden sm:flex-row sm:justify-between">
        {/* <CookieBannerButton variant="footer" className=" mt-2 px-2 font-bold uppercase text-goehteblue text-xs md:text-sm whitespace-normal break rounded-none text-center " /> */}
        <div className="flex gap-1">
          <Button asChild variant="link" className="text-muted-foreground py-0">
            <Link href={"/imprint"}>{t("imprint")}</Link>
          </Button>
          <Button asChild variant="link" className="text-muted-foreground py-0">
            <Link href={"/privacy"}>{t("privacy")}</Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 text-sm text-secondary">
          {t.rich("love", {
            heart: () => <BiHeart />,
          })}
        </div>
      </div>
    </div>
  );
}

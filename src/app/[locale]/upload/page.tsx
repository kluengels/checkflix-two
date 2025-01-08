// *** page to upload and parse zip/csv-file

import FormDropzone from "./_components/FormDropzone";

import React from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function page() {
  const t = await getTranslations("Upload");

  // default / on first load: show dropzone
  return (
    <article>
      <h1 className="text-3xl sm:text-4xl md:text-5xl">{t("title")}</h1>
      <p className="mt-4 text-pretty text-base sm:text-lg">
        {t.rich("subtitle", {
          tutorial: (chunks) => (
            <a
              href="\#tutorial"
              className="decoration-action underline underline-offset-2"
            >
              {chunks}
            </a>
          ),
          privacy: (chunks) => (
            <Link
              href="/privacy"
              className="decoration-action underline underline-offset-2"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>

      <FormDropzone className="my-8" />
    </article>
  );
}

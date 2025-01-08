"use client";
// system / framework imports
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Locale, useRouter } from "@/i18n/routing";
import { setMany } from "idb-keyval";
import { useData } from "@/context/DataProvider";

// ui imports
import { BiX } from "react-icons/bi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BiInfoCircle } from "react-icons/bi";
import { LoadingButton } from "@/components/ui/LoadingButton";

// data processing functions
import parseData from "@/actions/parseData";
import seperateData from "@/actions/seperateData";
import enrichData from "@/actions/enrichData";

// other imports
import DeleteDataButton from "./DeleteDataButton";
import LoadDummyDataButton from "./LoadDummyDataButton";
import getErrorMessage from "@/utils/getErrorMessage";
import { cn } from "@/lib/utils";

/**
 * Renders a dropzone for file upload, processes the file and starts the analysis. Saves date in browser storage and redirects to the dashboard page if successfull.
 */
export default function FormDropzone({ className }: { className?: string }) {
  const lang = useLocale() as Locale;
  const t = useTranslations("Upload");
  const router = useRouter();
  const { setHasStorageData } = useData();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);

  async function startAnalysis(
    e: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> {
    e.preventDefault();
    setPending(true);

    if (!file) return;

    // parse raw data, runs client-side
    const errorMessages = {
      csvNotFound: t("cvsNotFoundError"),
      csvNotValid: t("csvNotValidError"),
      parsingAborted: t("parsingAbortedError"),
      unexpectedData: t("unexpectedDataError"),
      noValidData: t("noValidDataError"),
    };
    const { data: parsedData, error: parsedError } = await parseData(
      file,
      errorMessages,
    );
    if (parsedError || !parsedData) {
      setError(t("parsingerror", { message: parsedError }));
      setPending(false);
      return;
    }

    // create a user list
    const userList = Array.from(
      new Set(parsedData.map((item) => item["user"])),
    );

    // seperate movies and tv shows
    const { movieData, tvShowData } = seperateData(parsedData);

    // enrich data with details from the movie database
    const [
      { data: enrichedMovieData, error: enrichedMovieError },
      { data: enrichedTvShowData, error: enrichedTvShowError },
    ] = await Promise.all([
      enrichData(movieData, lang, "movie"),
      enrichData(tvShowData, lang, "tv"),
    ]);

    // error handling
    if (enrichedMovieError) {
      setError(getErrorMessage(enrichedMovieError));
      setPending(false);
      return;
    }
    if (enrichedTvShowError) {
      setError(getErrorMessage(enrichedTvShowError));
      setPending(false);
      return;
    }

    // save data in storage
    await setMany([
      ["MY_DATA", parsedData],
      ["MY_MOVIES", enrichedMovieData],
      ["MY_SERIES", enrichedTvShowData],
      ["USERLIST", userList],
    ])
      .then(() => {
        // redirect to dashboard
        setHasStorageData(true);
        router.push("/dashboard");
      })
      .catch((error) => {
        setError(t("storageError") + getErrorMessage(error));
      })
      .finally(() => {
        setPending(false);
      });
  }

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false, // Single file only
    accept: { "text/csv": [".csv"], "application/zip": [".zip"] },
    onDrop: (acceptedFiles) => {
      setError(null);

      if (!acceptedFiles[0]) return;
      // if (
      //   acceptedFiles[0].name !== "netflix-report.zip" &&
      //   acceptedFiles[0].name !== "ViewingActivity.csv"
      // ) {
      //   setError("Invalid file name");
      //   setTimeout(() => {
      //     setError(null);
      //   }, 3000);
      //   return;
      // }
      setFile(acceptedFiles[0]);
    },

    // Error handling if user dragged a file with invalid type
    onDropRejected(fileRejections) {
      const fileRejection = fileRejections[0];
      if (fileRejection.errors[0].code === "file-invalid-type") {
        setError(t("fileTypeError"));

        // wait for 3 seconds and clear the error
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    },
  });

  return (
    <>
      {/* Drag and Drop field */}
      <div
        {...getRootProps()}
        className={cn(
          "cursor-pointer rounded-lg border-2 border-dashed border-primary bg-background p-24 text-center",
          {
            "border-secondary": isDragActive,
          },
          className,
        )}
      >
        <input {...getInputProps()} className="bg-muted" id="dropzone" />
        {isDragActive ? (
          <p className="text-secondary">{t("dropHere")}</p>
        ) : (
          <div>
            <p className="text-card-foreground">{t("dropInstructions")}</p>
            <p className="text-xs text-card-foreground">
              netflix-report.zip // ViewingActivity.csv
            </p>
          </div>
        )}
      </div>

      {/* Show selected file with option to remove it */}
      <div>
        {error && <p className="text-destructive">{error}</p>}
        {file && !error && (
          <div className="flex items-center justify-between">
            <p>Selected file: {file.name}</p>
            <button
              onClick={() => {
                setFile(null);
              }}
              className="text-destructive"
              disabled={pending}
            >
              <BiX className="h-8 w-8" />
            </button>
          </div>
        )}
      </div>

     {/* Loading Button and Link to load test data set */} 
      <div className="mt-4 flex gap-4">
        <LoadingButton
          disabled={!file || !!error || pending}
          onClick={startAnalysis}
          loading={pending}
          className="flex-shrink-0"
        >
          {pending ? t("uploadButtonPending") : t("uploadButton")}
        </LoadingButton>

        {!pending && <LoadDummyDataButton {...{ setPending, setError }} />}
      </div>
      
      {/* Privacy Info Card with Button to delete data */}
      {!pending && (
        <Card className="mt-24 opacity-70 hover:opacity-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BiInfoCircle />
              {t("privacyCard.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="items-end justify-normal gap-10 sm:flex">
            <p className="mt-0">{t("privacyCard.text")}</p>
            <DeleteDataButton className="mt-5 sm:mt-0" />
          </CardContent>
        </Card>
      )}
    </>
  );
}

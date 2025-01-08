"use client";
import JSZip from "jszip";
import Papa, { ParseResult } from "papaparse";
import getErrorMessage from "@/utils/getErrorMessage";

import {
  ActivitySchemaArray,
  expectedHeaders,
  RowData,
} from "../types/customTypes";

type Errors = {
  csvNotFound: string;
  csvNotValid: string;
  parsingAborted: string;
  unexpectedData: string;
  noValidData: string;
};

/**
 * Parse the data from the uploaded file. If the file is a zip file, extract the csv file from it.
 */
export default async function parseData(file: File, errorMessages: Errors) {
  let csvFile: null | File = null;

  try {
    // user uploaded a csv file: use it directly
    if (file.type === "text/csv") {
      csvFile = file;
    }

    // otherwise extract csv from zip
    if (file.type === "application/zip") {
      const zip = await JSZip.loadAsync(file);
      if (!zip.file("CONTENT_INTERACTION/ViewingActivity.csv")) {
        throw errorMessages.csvNotFound;
      } else {
        const csvFileBlob = zip
          .file("CONTENT_INTERACTION/ViewingActivity.csv")
          ?.async("blob");
        if (csvFileBlob) {
          csvFile = new File([await csvFileBlob], "ViewingActivity.csv", {
            type: "text/csv",
          });
        }
      }
      if (!csvFile) throw errorMessages.csvNotFound;
    }

    // Parse the CSV file with PapaParse
    const parsedCsvData: ParseResult<RowData> = await new Promise(
      (resolve, reject) => {
        Papa.parse(csvFile as File, {
          header: true,
          // Skip lines that don't contain data
          skipEmptyLines: true,

          // check if the headers are valid
          beforeFirstChunk: (chunk) => {
            const firstRow = chunk.split("\n")[0]; // Get the first row (header line)
            const actualHeaders = firstRow.split(","); // Split headers by comma
            const headersValid = expectedHeaders.every((header) =>
              actualHeaders.includes(header),
            );

            if (!headersValid) {
              // throw error if headers are missing
              reject(errorMessages.csvNotValid);
            }
            return chunk; // Continue parsing
          },

          // Transform the data to the correct types
          transform: (value, field) => {
            // make sure that the Title field is always a string
            if (field === "Title") {
              return value.toString();
            }

            // return Start Time as a Date object
            if (field === "Start Time") {
              // Time provided by netflix is in UTC format
              const splitdate = value.split(" ");
              const tempdate = splitdate[0] + "T" + splitdate[1] + "Z";
              return new Date(tempdate);
            }

            // return Duration as a number
            if (field === "Duration") {
              const splitDuration = value.split(":");
              return (
                parseInt(splitDuration[0]) * 3600 +
                parseInt(splitDuration[1]) * 60 +
                parseInt(splitDuration[2])
              );
            }

            return value; // Leave other values as they are
          },
          complete: (result: ParseResult<RowData>) => {
            resolve(result);
          },
          error: (error) => reject(error),
        });
      },
    );

    if (parsedCsvData.meta.aborted) throw errorMessages.parsingAborted;

    // clean up the data and check if item is a movie or tv show
    const filteredData = parsedCsvData.data.flatMap((row) => {
      // skip columns that have data for "Supplemental Video Type" (indicating that it is a trailer or teaser)
      if (row["Supplemental Video Type"] !== "") return [];

      // ckeck if movie or tv show - assumption: if the title has more than 2 colons, it is a tv show
      // example: "Breaking Bad: Season 1: Pilot"
      const splitTitle = row["Title"].split(":");
      const type = splitTitle?.length > 2 ? "series" : "movie";

      const transformedRow = {
        user: row["Profile Name"],
        fulltitle: row["Title"],
        type: type,
        date: row["Start Time"],
        duration: row["Duration"],
      };
      return transformedRow;
    });

    //validate the data against schema with Zod
    const {
      success: validationSuccess,
      data: validatedData,
      error: validationError,
    } = ActivitySchemaArray.safeParse(filteredData);

    if (!validationSuccess) {
      console.error(validationError);
      throw errorMessages.unexpectedData;
    }
    if (validatedData.length === 0) {
      throw errorMessages.noValidData;
    }

    return { data: validatedData, error: null };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return { data: null, error: errorMessage };
  }
}

"use server";

import { getTranslations } from "next-intl/server";
import { z } from "zod";
import { render } from "@react-email/components";
import React from "react";
import transporter from "@/config/emailconfig";
import ContactEmailTemplate from "../_email/ContactEmailTemplate";
import getErrorMessage from "@/utils/getErrorMessage";

export default async function sendMail(values: unknown) {
  const t = await getTranslations("Contact");
  const formSchema = z.object({
    name: z
      .string()
      .min(2, t("username.minlength", { length: 2 }))
      .max(50, t("username.maxlength", { length: 50 })),
    email: z.string().email(t("email.invalid")),
    message: z
      .string()
      .min(10, t("message.minlength", { length: 10 }))
      .max(2000, t("message.maxlength", { length: 2000 })),
    security: z
      .string()
      .min(1, t("security.required"))
      .trim()
      .toLowerCase(),
    terms: z
      .boolean()
      .refine((value) => value, {
        message: t("terms.required"),
      }),
    phone: z.string().optional(),
  });

  try {
    // *** Validate form data ***
    const validation = formSchema.safeParse(values);
    if (validation.error) {
      let errorMessage = "";
      validation.error.issues.forEach((issue) => {
        errorMessage = errorMessage + String(issue.path[0]) + ": " + issue.message;
      });
      console.error("errorMessage", errorMessage);
      throw new Error(errorMessage);
    }
    const validatedData = validation.data;
    if (validatedData.security !== "paris") {
      throw new Error(t("security.invalid"));
    }
    if (validatedData.phone !== "") {
      throw new Error(t("phone.trapped"));
    }

    // console.log(validatedData);

    // *** Send  email to editor or admin ***
    // render email
    const emailHtml = await render(
      React.createElement(ContactEmailTemplate, {
        values: validatedData,
      }),
    );

    // construct email
    const options = {
      from: `"Checkflix" <${process.env.NEXT_EMAIL_USER!}>`, // sender address
      to: process.env.NEXT_EMAIL_TO, // list of receivers
      replyTo: `"${validatedData.name}" <${validatedData.email}>`, // name and email from form
      subject: "New contact form submission", // Subject line
      html: emailHtml,
    };

    // Send email
    const info = await transporter.sendMail(options);
    console.log("Message sent: %s", info.messageId);

    return { error: null };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(errorMessage);
    return { error: errorMessage };
  }
}

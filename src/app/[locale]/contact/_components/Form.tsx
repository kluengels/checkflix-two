"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import sendMail from "../_server/sendMail";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";


export default function ContactForm() {
  const t = useTranslations("Contact");

  // state for form
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const formSchema = z.object({
    name: z
      .string()
      .min(2, {
        message: t("username.minlength", { length: 2 }),
      })
      .max(50, {
        message: t("username.maxlength", { length: 50 }),
      }),
    email: z.string().email({
      message: t("email.invalid"),
    }),

    message: z
      .string()
      .min(10, {
        message: t("message.minlength", { length: 10 }),
      })
      .max(2000, {
        message: t("message.maxlength", { length: 2000 }),
      }),
    security: z
      .string({
        required_error: t("security.required"),
      })
      .trim()
      .toLowerCase(),
    terms: z
      .boolean()
      .default(false)
      .refine((value) => value, {
        message: t("terms.required"),
      }),
    phone: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      phone: "",
      security: "",
      terms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setPending(true);
    setResult(null);

    // run server side action to send OTP
    const { error } = await sendMail(values);
    if (error) {
      if (error === t("security.invalid")) {
        form.setError("security", { message: error });
        setPending(false);
        return;
      }
      console.error(error);
      setResult({ success: false, message: error });

      setTimeout(() => {
        setPending(false);
        setResult(null);
      }, 5000);
      return;
    } else
      form.reset({
        name: undefined,
        email: undefined,
        message: undefined,
        phone: "",
        security: undefined,
        terms: false,
      });
    setResult({ success: true, message: t("successContact") });
    setPending(false);
    // clear result after 10 seconds
    setTimeout(() => {
      setPending(false);
      setResult(null);
    }, 10000);
  }

  return (
    <Card className="mx-auto mt-12 w-full">
      <CardContent className="mt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto max-w-3xl space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("username.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("username.placeholder")}
                      type=""
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email.label")}</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="email"
                      placeholder={t("email.placeholder")}
                      type="email"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("message.label")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("message.label")}
                      autoComplete="off"
                      className="h-48 resize-y"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="security"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("security.label")}</FormLabel>
                  <FormDescription>
                    {t("security.description")}
                    <br />
                    <span className="font-semibold">
                      {t("security.question")}
                    </span>
                  </FormDescription>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder={t("security.placeholder")}
                      type=""
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("terms.label")}</FormLabel>
                    <FormDescription>
                      {t.rich("terms.descriptionContact", {
                        privacylink: (chunks) => (
                          <Link
                            href="/privacy"
                            className="underline underline-offset-2"
                          >
                            {chunks}
                          </Link>
                        ),
                      })}
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Honig */}
            <div className="absolute left-[-9999px]">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="phone">Your phone number</FormLabel>

                    <FormControl>
                      <Input
                        id="phone"
                        tabIndex={-1}
                        aria-hidden
                        type="phone"
                        autoFocus={false}
                        autoComplete="off"
                        placeholder="Your phone number"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Button
                type="submit"
                className={`${pending && "cursor-not-allowed opacity-50"} shrink-0`}
                disabled={pending}
              >
                {pending ? t("button.pending") : t("button.submit")}
              </Button>

              {result && (
                <div
                  className={`${
                    result.success ? "text-green-600" : "text-destructive"
                  } text-pretty leading-none`}
                >
                  {result.message}
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

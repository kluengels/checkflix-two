import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.NEXT_EMAIL_HOST!,
  port: Number(process.env.NEXT_EMAIL_PORT!),
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.NEXT_EMAIL_USER!,
    pass: process.env.NEXT_EMAIL_PASS!,
  },
  // dkim: {
  //   domainName: "lfgab.com",
  //   keySelector: process.env.NEXT_EMAIL_DKIM_SELECTOR!,
  //   privateKey: process.env.NEXT_EMAIL_DKIM_PRIVATE!,
  // },
});

export default transporter;

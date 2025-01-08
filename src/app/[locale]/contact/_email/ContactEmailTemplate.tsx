// Template for emails for submissions of contact form

import {
  Html,
  Container,
  Text,
  Preview,
  Body,
  Head,
  Tailwind,
  Section,
} from "@react-email/components";

import * as React from "react";

interface EditorNotifactionEmail {
  values: {
    name: string;
    email: string;
    message: string;
    security: string;
    terms: boolean;
  };
}

export default function ContactEmailTemplate({
  values,
}: EditorNotifactionEmail) {
  return (
    <Html>
      <Head />
      <Preview>New message from contact form on Checkflix</Preview>
      <Tailwind>
        <Body className="bg-white">
          <Container className="overflow-hidden">
            <Section className="my-4 rounded-md border border-solid border-slate-300 p-5">
              <Text>Dear Checkflix-Admin,</Text>
              <Text>
                <b>{values.name}</b> ({values.email}) submitted a message via
                the contact form on <b>checkflix.io</b>.
              </Text>
              <Text>You may answer the sender by replying to this email.</Text>

              <Text>
                <b>Message: </b>
                {values.message}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

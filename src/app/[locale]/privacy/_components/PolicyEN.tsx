import { useTranslations } from "next-intl";
import CookieDetails from "@/components/cookies/CookieDetails";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { services } from "@/config/cookieConsent.config";

export default function PolicyEN() {
  const t = useTranslations("Privacy");
  return (
    <>
      <p>
        Personal data (usually referred to just as „data“ below) will only be
        processed by us to the extent necessary and for the purpose of providing
        a functional and user-friendly website, including its contents, and the
        services offered there.
      </p>
      <p>
        Per Art. 4 No. 1 of Regulation (EU) 2016/679, i.e. the General Data
        Protection Regulation (hereinafter referred to as the „GDPR“),
        „processing“ refers to any operation or set of operations such as
        collection, recording, organization, structuring, storage, adaptation,
        alteration, retrieval, consultation, use, disclosure by transmission,
        dissemination, or otherwise making available, alignment, or combination,
        restriction, erasure, or destruction performed on personal data, whether
        by automated means or not.
      </p>
      <p>
        The following privacy policy is intended to inform you in particular
        about the type, scope, purpose, duration, and legal basis for the
        processing of such data either under our own control or in conjunction
        with others. We also inform you below about the third-party components
        we use to optimize our website and improve the user experience which may
        result in said third parties also processing data they collect and
        control.
      </p>
      <p>Our privacy policy is structured as follows:</p>
      <p>
        I. Information about us as controllers of your data
        <br />
        II. The rights of users and data subjects
        <br />
        III. Information about the data processing
      </p>
      <h3 className="mb-1 mt-1 text-lg font-semibold">
        I. Information about us as controllers of your data
      </h3>
      <p className="mb-2">
        The party responsible for this website (the „controller“) for purposes
        of data protection law is:
      </p>
      Steffen Ermisch
      <br />
      Pressebüro JP4
      <br />
      Richard-Wagner-Str. 10-12
      <br />
      50674 Köln, Germany
      <p>E-Mail: checkflix@gmail.com</p>
      <h3 className="mb-1 mt-1 text-lg font-semibold">
        II. The rights of users and data subjects
      </h3>
      <p>
        With regard to the data processing to be described in more detail below,
        users and data subjects have the right
      </p>
      <ul className="wp-block-list">
        <li>
          to confirmation of whether data concerning them is being processed,
          information about the data being processed, further information about
          the nature of the data processing, and copies of the data (cf. also
          Art. 15 GDPR);
        </li>

        <li>
          to correct or complete incorrect or incomplete data (cf. also Art. 16
          GDPR);
        </li>

        <li>
          to the immediate deletion of data concerning them (cf. also Art. 17
          DSGVO), or, alternatively, if further processing is necessary as
          stipulated in Art. 17 Para. 3 GDPR, to restrict said processing per
          Art. 18 GDPR;
        </li>

        <li>
          to receive copies of the data concerning them and/or provided by them
          and to have the same transmitted to other providers/controllers (cf.
          also Art. 20 GDPR);
        </li>

        <li>
          to file complaints with the supervisory authority if they believe that
          data concerning them is being processed by the controller in breach of
          data protection provisions (see also Art. 77 GDPR).
        </li>
      </ul>
      <p>
        In addition, the controller is obliged to inform all recipients to whom
        it discloses data of any such corrections, deletions, or restrictions
        placed on processing the same per Art. 16, 17 Para. 1, 18 GDPR. However,
        this obligation does not apply if such notification is impossible or
        involves a disproportionate effort. Nevertheless, users have a right to
        information about these recipients.
      </p>
      <p className="font-semibold">
        Likewise, under Art. 21 GDPR, users and data subjects have the right to
        object to the controller’s future processing of their data pursuant to
        Art. 6 Para. 1 lit. f) GDPR. In particular, an objection to data
        processing for the purpose of direct advertising is permissible.
      </p>
      <h3 className="mb-1 mt-1 text-lg font-semibold">
        III. Information about the data processing
      </h3>
      <p>
        Your data processed when using our website will be deleted or blocked as
        soon as the purpose for its storage ceases to apply, provided the
        deletion of the same is not in breach of any statutory storage
        obligations or unless otherwise stipulated below.
      </p>
      {/* Cookie info from nextjs */}
      <h4>{t("cookies.heading")}</h4>
      <p className="text-pretty">{t("cookies.description")}</p>
      {/* <CookieBannerButton variant="footer" /> */}
      {Object.entries(services).map(([service, value]) => {
        return (
          <Accordion type="single" collapsible key={service}>
            <AccordionItem value={value.title}>
              <AccordionTrigger>{value.title}</AccordionTrigger>
              <AccordionContent>
                <CookieDetails cookieDetails={value} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
      <h4 className="mt-8">Contact</h4>
      <p>
        If you contact us via email or the contact form, the data you provide
        will be used for the purpose of processing your request. We must have
        this data in order to process and answer your inquiry; otherwise we will
        not be able to answer it in full or at all.
      </p>
      <p>
        The legal basis for this data processing is Art. 6 Para. 1 lit. b) GDPR.
      </p>
      <p>
        Your data will be deleted once we have fully answered your inquiry and
        there is no further legal obligation to store your data, such as if an
        order or contract resulted therefrom.
      </p>
      <h4>Server data</h4>
      <p>
        The web hosting provider of this website is Hetzner (Hetzner Online
        GmbH, Industriestr. 25, 91710 Gunzenhausen, Germany).
      </p>
      <p>
        For technical reasons, the following data sent by your internet browser
        to us or to our server provider will be collected, especially to ensure
        a secure and stable website: These server log files record the type and
        version of your browser, operating system, the website from which you
        came (referrer URL), the webpages on our site visited, the date and time
        of your visit, as well as the IP address from which you visited our
        site.
      </p>
      <p>
        The data thus collected will be temporarily stored, but not in
        association with any other of your data.
      </p>
      <p>
        The basis for this storage is Art. 6 Para. 1 lit. f) GDPR. Our
        legitimate interest lies in the improvement, stability, functionality,
        and security of our website.
      </p>
      <p>We have concluded an data processing agreement with Hetzner.</p>
      <h4>App data</h4>
      <p>
        When you submit a file within the app &quot;Checkflix&quot; the data you
        provide will be processed and stored locally on your device. The file
        that is analyzed contains information about what you have watched on
        Netflix, when, where and with which device.
      </p>
      <h4>Data processing by TMDB</h4>
      <p>
        Checkflix displays images, genre categorization and summaries of movies
        and series you have watched. This data is provided by The Movie Database
        (TMDB). To make this possible, titles of series and movies you have
        watched on Netflix are transferred to TMDB. These API calls run
        serverside and are not linked to your personal data.
      </p>
      <p className="mt-8 italic">
        This privacy policy was created with the help of{" "}
        <a
          href="https://www.generator-datenschutzerklärung.de"
          target="_blank"
          rel="noopener"
          className="underline underline-offset-2"
        >
          Model Data Protection Statement
        </a>{" "}
        for{" "}
        <a
          href="https://www.bewertung-löschen24.de"
          rel="nofollow noopener"
          target="_blank"
          className="underline underline-offset-2"
        >
          Anwaltskanzlei Weiß &amp; Partner
        </a>
      </p>
    </>
  );
}

import { useTranslations } from "next-intl";
import CookieDetails from "@/components/cookies/CookieDetails";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { services } from "@/config/cookieConsent.config";

export default function PolicyDE() {
  const t = useTranslations("Privacy");
  return (
    <>
      <p>
        Personenbezogene Daten (nachfolgend zumeist nur „Daten“ genannt) werden
        von uns nur im Rahmen der Erforderlichkeit sowie zum Zwecke der
        Bereitstellung eines funktionsfähigen und nutzerfreundlichen
        Internetauftritts, inklusive seiner Inhalte und der dort angebotenen
        Leistungen, verarbeitet.
      </p>
      <p>
        Gemäß Art. 4 Ziffer 1. der Verordnung (EU) 2016/679, also der
        Datenschutz-Grundverordnung (nachfolgend nur „DSGVO“ genannt), gilt als
        „Verarbeitung“ jeder mit oder ohne Hilfe automatisierter Verfahren
        ausgeführter Vorgang oder jede solche Vorgangsreihe im Zusammenhang mit
        personenbezogenen Daten, wie das Erheben, das Erfassen, die
        Organisation, das Ordnen, die Speicherung, die Anpassung oder
        Veränderung, das Auslesen, das Abfragen, die Verwendung, die Offenlegung
        durch Übermittlung, Verbreitung oder eine andere Form der
        Bereitstellung, den Abgleich oder die Verknüpfung, die Einschränkung,
        das Löschen oder die Vernichtung.
      </p>
      <p>
        Mit der nachfolgenden Datenschutzerklärung informieren wir Sie
        insbesondere über Art, Umfang, Zweck, Dauer und Rechtsgrundlage der
        Verarbeitung personenbezogener Daten, soweit wir entweder allein oder
        gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung
        entscheiden. Zudem informieren wir Sie nachfolgend über die von uns zu
        Optimierungszwecken sowie zur Steigerung der Nutzungsqualität
        eingesetzten Fremdkomponenten, soweit hierdurch Dritte Daten in wiederum
        eigener Verantwortung verarbeiten.
      </p>
      <p>Unsere Datenschutzerklärung ist wie folgt gegliedert:</p>
      <p>
        I. Informationen über uns als Verantwortliche
        <br />
        II. Rechte der Nutzer und Betroffenen
        <br />
        III. Informationen zur Datenverarbeitung
      </p>
      <h3 className="mb-1 mt-1 text-lg font-semibold">
        I. Informationen über uns als Verantwortliche
      </h3>
      <p>
        Verantwortlicher Anbieter dieses Internetauftritts im
        datenschutzrechtlichen Sinne ist:
      </p>
      Steffen Ermisch
      <br />
      Pressebüro JP4
      <br />
      Richard-Wagner-Str. 10-12
      <br />
      50674 Köln
      <p>E-Mail: checkflix@gmail.com</p>
      <h3 className="mb-1 mt-1 text-lg font-semibold">
        II. Rechte der Nutzer und Betroffenen
      </h3>
      <p>
        Mit Blick auf die nachfolgend noch näher beschriebene Datenverarbeitung
        haben die Nutzer und Betroffenen das Recht
      </p>
      <ul className="wp-block-list">
        <li>
          auf Bestätigung, ob sie betreffende Daten verarbeitet werden, auf
          Auskunft über die verarbeiteten Daten, auf weitere Informationen über
          die Datenverarbeitung sowie auf Kopien der Daten (vgl. auch Art. 15
          DSGVO);
        </li>

        <li>
          auf Berichtigung oder Vervollständigung unrichtiger bzw.
          unvollständiger Daten (vgl. auch Art. 16 DSGVO);
        </li>

        <li>
          auf unverzügliche Löschung der sie betreffenden Daten (vgl. auch Art.
          17 DSGVO), oder, alternativ, soweit eine weitere Verarbeitung gemäß
          Art. 17 Abs. 3 DSGVO erforderlich ist, auf Einschränkung der
          Verarbeitung nach Maßgabe von Art. 18 DSGVO;
        </li>

        <li>
          auf Erhalt der sie betreffenden und von ihnen bereitgestellten Daten
          und auf Übermittlung dieser Daten an andere Anbieter/Verantwortliche
          (vgl. auch Art. 20 DSGVO);
        </li>

        <li>
          auf Beschwerde gegenüber der Aufsichtsbehörde, sofern sie der Ansicht
          sind, dass die sie betreffenden Daten durch den Anbieter unter Verstoß
          gegen datenschutzrechtliche Bestimmungen verarbeitet werden (vgl. auch
          Art. 77 DSGVO).
        </li>
      </ul>
      <p>
        Darüber hinaus ist der Anbieter dazu verpflichtet, alle Empfänger, denen
        gegenüber Daten durch den Anbieter offengelegt worden sind, über jedwede
        Berichtigung oder Löschung von Daten oder die Einschränkung der
        Verarbeitung, die aufgrund der Artikel 16, 17 Abs. 1, 18 DSGVO erfolgt,
        zu unterrichten. Diese Verpflichtung besteht jedoch nicht, soweit diese
        Mitteilung unmöglich oder mit einem unverhältnismäßigen Aufwand
        verbunden ist. Unbeschadet dessen hat der Nutzer ein Recht auf Auskunft
        über diese Empfänger.
      </p>
      <p className="font-semibold">
        Ebenfalls haben die Nutzer und Betroffenen nach Art. 21 DSGVO das Recht
        auf Widerspruch gegen die künftige Verarbeitung der sie betreffenden
        Daten, sofern die Daten durch den Anbieter nach Maßgabe von Art. 6 Abs.
        1 lit. f) DSGVO verarbeitet werden. Insbesondere ist ein Widerspruch
        gegen die Datenverarbeitung zum Zwecke der Direktwerbung statthaft.
      </p>
      <h3 className="mb-1 mt-1 text-lg font-semibold">
        III. Informationen zur Datenverarbeitung
      </h3>
      <p>
        Ihre bei Nutzung unseres Internetauftritts verarbeiteten Daten werden
        gelöscht oder gesperrt, sobald der Zweck der Speicherung entfällt, der
        Löschung der Daten keine gesetzlichen Aufbewahrungspflichten
        entgegenstehen und nachfolgend keine anderslautenden Angaben zu
        einzelnen Verarbeitungsverfahren gemacht werden.
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
      <h4 className="mt-8">Kontaktanfragen / Kontaktmöglichkeit</h4>
      <p>
        Sofern Sie per Kontaktformular oder E-Mail mit uns in Kontakt treten,
        werden die dabei von Ihnen angegebenen Daten zur Bearbeitung Ihrer
        Anfrage genutzt. Die Angabe der Daten ist zur Bearbeitung und
        Beantwortung Ihre Anfrage erforderlich – ohne deren Bereitstellung
        können wir Ihre Anfrage nicht oder allenfalls eingeschränkt beantworten.
      </p>
      <p>
        Rechtsgrundlage für diese Verarbeitung ist Art. 6 Abs. 1 lit. b) DSGVO.
      </p>
      <p>
        Ihre Daten werden gelöscht, sofern Ihre Anfrage abschließend beantwortet
        worden ist und der Löschung keine gesetzlichen Aufbewahrungspflichten
        entgegenstehen, wie bspw. bei einer sich etwaig anschließenden
        Vertragsabwicklung.
      </p>
      <h4>Serverdaten</h4>
      <p>
        Diese Webseite nutzt in Deutschland befindliche Server von Hetzner
        (Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen) für das
        Hosting.{" "}
      </p>
      <p>
        Aus technischen Gründen, insbesondere zur Gewährleistung eines sicheren
        und stabilen Internetauftritts, werden Daten durch Ihren
        Internet-Browser an uns bzw. an unseren Webspace-Provider übermittelt.
        Mit diesen sog. Server-Logfiles werden u.a. Typ und Version Ihres
        Internetbrowsers, das Betriebssystem, die Website, von der aus Sie auf
        unseren Internetauftritt gewechselt haben (Referrer URL), die Website(s)
        unseres Internetauftritts, die Sie besuchen, Datum und Uhrzeit des
        jeweiligen Zugriffs sowie die IP-Adresse des Internetanschlusses, von
        dem aus die Nutzung unseres Internetauftritts erfolgt, erhoben.
      </p>
      <p>
        Diese so erhobenen Daten werden vorrübergehend gespeichert, dies jedoch
        nicht gemeinsam mit anderen Daten von Ihnen.
      </p>
      <p>
        Diese Speicherung erfolgt auf der Rechtsgrundlage von Art. 6 Abs. 1 lit.
        f) DSGVO. Unser berechtigtes Interesse liegt in der Verbesserung,
        Stabilität, Funktionalität und Sicherheit unseres Internetauftritts.
      </p>
      <p>
        Wir haben mit Hetzner einen Vertrag über die Auftragsverarbeitung
        abgeschlossen.
      </p>
      <h4>App-Daten</h4>
      <p>
        Wenn Sie in der App &quot;Checkflix&quot; eine Datei übermitteln, werden die von
        Ihnen übermittelten Daten in Ihrem Browser verarbeitet und gespeichert.
        Die Datei, die ausgewertet wird, enthält Informationen dazu, was Sie bei
        Netflix wann, wo und mit welchem Gerät geguckt haben.
      </p>
      <h4>Datenverarbeitung durch TMDB</h4>
      <p>
        Checkflix zeigt Bilder, Genres und Zusammenfassungen von Serien und
        Filmen an, die Sie sich angesehen haben. Diese werden von der Datenbank
        The Movie Database (TMDB) zur Verfügung gestellt. Damit das möglich ist,
        werden Titel der Serien und Filme an TMDB über eine
        Programmierschnittstelle (API) übermittelt. Die Abfragen finden
        serverseitig statt. Es werden dabei keine Daten, die Rückschlüsse auf
        Ihre Person zulassen könnten, übertragen.
      </p>
      <p className="mt-8 italic">
        Diese Datenschutz-Erklärung wurde erstellt mit Hilfe der{" "}
        <a
          href="https://www.generator-datenschutzerklärung.de"
          target="_blank"
          rel="noopener"
          className="underline underline-offset-2"
        >
          Muster-Datenschutzerklärung
        </a>{" "}
        der{" "}
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

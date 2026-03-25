import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSeo } from "../hooks/useSeo";

export default function LegalPage({ type }) {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const content = t(`legal.${type}`, { returnObjects: true });
  const title = type === "privacy" ? t("meta.privacyTitle") : t("meta.termsTitle");
  const description = type === "privacy" ? t("meta.privacyDescription") : t("meta.termsDescription");

  useSeo({
    lang: i18n.language,
    title,
    description,
  });

  return (
    <section className="legal-shell">
      <div className="legal-card">
        <Link className="legal-back" to={`/${lang}`}>
          {t("common.backHome")}
        </Link>
        <span className="eyebrow">{type === "privacy" ? t("nav.privacy") : t("nav.terms")}</span>
        <h1 className="legal-title">{content.title}</h1>
        <p className="legal-lead">{content.lead}</p>
        <p className="legal-updated">
          {t("common.updated")}: 24 March 2026
        </p>
        <div className="legal-sections">
          {content.sections.map((section) => (
            <article key={section.title} className="legal-section">
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

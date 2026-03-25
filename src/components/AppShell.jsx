import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { calendlyUrl, languageOptions, supportedLanguages } from "../content/siteContent";

function buildLocalizedPath(targetLang, pathname, search, hash) {
  const segments = pathname.split("/").filter(Boolean);
  const tail = segments.length && supportedLanguages.includes(segments[0]) ? segments.slice(1) : segments;
  const base = `/${[targetLang, ...tail].join("/")}`;
  return `${base}${search}${hash}`;
}

function LanguageSwitcher({ lang, compact = false, onNavigate }) {
  const location = useLocation();

  return (
    <div className={`lang-switch ${compact ? "compact" : ""}`}>
      {languageOptions.map((item) => (
        <Link
          key={item.code}
          className={`lang-chip ${item.code === lang ? "active" : ""}`}
          to={buildLocalizedPath(item.code, location.pathname, location.search, location.hash)}
          onClick={onNavigate}
          aria-label={item.label}
        >
          <span aria-hidden="true">{item.flag}</span>
          {!compact && <span>{item.code.toUpperCase()}</span>}
        </Link>
      ))}
    </div>
  );
}

function Navigation({ lang, onNavigate }) {
  const { t } = useTranslation();

  const items = [
    { id: "how-it-works", label: t("nav.howItWorks") },
    { id: "benefits", label: t("nav.benefits") },
    { id: "examples", label: t("nav.examples", { defaultValue: t("nav.audience") }) },
    { id: "pricing", label: t("nav.pricing") },
  ];

  return (
    <>
      {items.map((item) => (
        <Link key={item.id} to={`/${lang}#${item.id}`} onClick={onNavigate}>
          {item.label}
        </Link>
      ))}
    </>
  );
}

export default function AppShell({ children, lang }) {
  const { t } = useTranslation();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const isLegalPage = location.pathname.includes("/privacy") || location.pathname.includes("/terms");

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (isLegalPage) {
      setShowStickyCta(false);
      return undefined;
    }

    function updateStickyCtaVisibility() {
      if (window.innerWidth > 1080) {
        setShowStickyCta(false);
        return;
      }

      const heroNode = document.querySelector(".hero-section");

      if (!heroNode) {
        setShowStickyCta(false);
        return;
      }

      const heroRect = heroNode.getBoundingClientRect();
      const threshold = Math.min(window.innerHeight * 0.72, 560);
      setShowStickyCta(heroRect.bottom < threshold);
    }

    updateStickyCtaVisibility();
    window.addEventListener("scroll", updateStickyCtaVisibility, { passive: true });
    window.addEventListener("resize", updateStickyCtaVisibility);

    return () => {
      window.removeEventListener("scroll", updateStickyCtaVisibility);
      window.removeEventListener("resize", updateStickyCtaVisibility);
    };
  }, [isLegalPage, location.pathname]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="nav-shell">
          <Link className="logo" to={`/${lang}`}>
            <span className="logo-mark" aria-hidden="true">
              <img src="/logo_128.png" alt="" />
            </span>
            <span>{t("common.brand")}</span>
          </Link>

          <nav className="nav-links desktop-only">
            <Navigation lang={lang} />
          </nav>

          <div className="nav-actions desktop-only">
            <LanguageSwitcher lang={lang} />
            <a className="btn btn-dark nav-cta" href={calendlyUrl} target="_blank" rel="noreferrer">
              {t("common.bookDemo")}
            </a>
          </div>

          <button
            className={`menu-toggle mobile-only ${menuOpen ? "active" : ""}`}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? t("common.close") : t("common.menu")}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        className={`mobile-drawer ${menuOpen ? "open" : ""}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setMenuOpen(false);
          }
        }}
      >
        <div className="mobile-panel">
          <div className="mobile-panel-top">
            <LanguageSwitcher lang={lang} onNavigate={() => setMenuOpen(false)} />
          </div>
          <nav className="mobile-nav">
            <Navigation lang={lang} onNavigate={() => setMenuOpen(false)} />
            <Link to={`/${lang}/privacy`} onClick={() => setMenuOpen(false)}>
              {t("nav.privacy")}
            </Link>
            <Link to={`/${lang}/terms`} onClick={() => setMenuOpen(false)}>
              {t("nav.terms")}
            </Link>
          </nav>
          <a className="btn btn-dark mobile-drawer-cta" href={calendlyUrl} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>
            {t("common.bookDemo")}
          </a>
        </div>
      </div>

      <main>{children}</main>

      {!isLegalPage && (
        <a className={`mobile-sticky-cta mobile-only ${showStickyCta ? "visible" : ""}`} href={calendlyUrl} target="_blank" rel="noreferrer">
          {t("common.bookDemo")}
        </a>
      )}

      <footer className="site-footer">
        <Link className="logo footer-logo" to={`/${lang}`}>
          <span className="logo-mark small" aria-hidden="true">
            <img src="/logo_128.png" alt="" />
          </span>
          <span>{t("common.brand")}</span>
        </Link>

        <div className="footer-links">
          <Link to={`/${lang}/privacy`}>{t("nav.privacy")}</Link>
          <Link to={`/${lang}/terms`}>{t("nav.terms")}</Link>
          <a href={`mailto:${t("common.email")}`}>{t("common.email")}</a>
        </div>

        <p className="footer-copy">
          © 2026 {t("common.brand")}. {t("common.allRightsReserved")}
        </p>
      </footer>
    </div>
  );
}

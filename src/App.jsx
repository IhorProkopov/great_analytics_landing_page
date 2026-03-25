import { Navigate, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AppShell from "./components/AppShell";
import LandingPage from "./components/LandingPage";
import LegalPage from "./components/LegalPage";
import { defaultLanguage, supportedLanguages } from "./content/siteContent";

function LocalizedLayout() {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const location = useLocation();
  const isSupported = Boolean(lang && supportedLanguages.includes(lang));

  useEffect(() => {
    if (isSupported && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [i18n, isSupported, lang]);

  useEffect(() => {
    if (isSupported && !location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [isSupported, location.pathname, location.hash]);

  if (!isSupported) {
    return <Navigate to={`/${defaultLanguage}`} replace />;
  }

  return (
    <AppShell lang={lang}>
      <Outlet />
    </AppShell>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${defaultLanguage}`} replace />} />
      <Route path="/:lang" element={<LocalizedLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="privacy" element={<LegalPage type="privacy" />} />
        <Route path="terms" element={<LegalPage type="terms" />} />
      </Route>
      <Route path="*" element={<Navigate to={`/${defaultLanguage}`} replace />} />
    </Routes>
  );
}

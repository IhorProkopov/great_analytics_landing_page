import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { defaultLanguage, languageDirectionMap, supportedLanguages } from "../content/siteContent";

function ensureHeadTag(selector, create) {
  const existing = document.head.querySelector(selector);

  if (existing) {
    return existing;
  }

  const element = create();
  document.head.appendChild(element);
  return element;
}

function buildAlternatePath(pathname, lang) {
  const parts = pathname.split("/").filter(Boolean);
  const tail = parts.length && supportedLanguages.includes(parts[0]) ? parts.slice(1) : parts;
  return `/${[lang, ...tail].filter(Boolean).join("/")}` || `/${lang}`;
}

export function useSeo({ lang, title, description }) {
  const location = useLocation();

  useEffect(() => {
    document.title = title;
    document.documentElement.lang = lang;
    document.documentElement.dir = languageDirectionMap[lang] ?? "ltr";

    const metaDescription = ensureHeadTag('meta[name="description"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      return tag;
    });
    metaDescription.setAttribute("content", description);

    const canonical = ensureHeadTag('link[rel="canonical"]', () => {
      const tag = document.createElement("link");
      tag.setAttribute("rel", "canonical");
      return tag;
    });
    canonical.setAttribute("href", `${window.location.origin}${location.pathname}`);

    document.head.querySelectorAll('link[data-alt="true"]').forEach((node) => node.remove());

    supportedLanguages.forEach((altLang) => {
      const alternate = document.createElement("link");
      alternate.setAttribute("rel", "alternate");
      alternate.setAttribute("hreflang", altLang);
      alternate.setAttribute("href", `${window.location.origin}${buildAlternatePath(location.pathname, altLang)}`);
      alternate.dataset.alt = "true";
      document.head.appendChild(alternate);
    });

    const xDefault = document.createElement("link");
    xDefault.setAttribute("rel", "alternate");
    xDefault.setAttribute("hreflang", "x-default");
    xDefault.setAttribute("href", `${window.location.origin}${buildAlternatePath(location.pathname, defaultLanguage)}`);
    xDefault.dataset.alt = "true";
    document.head.appendChild(xDefault);
  }, [description, lang, location.pathname, title]);
}

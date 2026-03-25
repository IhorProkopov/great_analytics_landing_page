import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { calendlyUrl } from "../content/siteContent";
import { useInView } from "../hooks/useInView";
import { useSeo } from "../hooks/useSeo";

const heroWordModes = {
  waste: "word-waste",
  full: "word-full",
  grow: "word-grow",
};

const heroFlowProducts = [
  { icon: "🥛", tone: "cool" },
  { icon: "🍎", tone: "warm" },
  { icon: "🍌", tone: "gold" },
  { icon: "🥚", tone: "neutral" },
  { icon: "🥐", tone: "warm" },
  { icon: "🧀", tone: "gold" },
  { icon: "📦", tone: "cool" },
];

const heroFlowInsights = [
  { value: "€4.8K", tone: "warm" },
  { value: "+12%", tone: "gold" },
  { value: "1.9d", tone: "danger" },
  { value: "87%", tone: "cool" },
];

const heroShelfHotspots = [
  {
    id: "top-seller-left",
    side: "left",
    xMin: 0,
    xMax: 333 / 1280,
    yMin: 0.14,
    yMax: 0.4,
    popupX: 0.06,
    popupY: 0.28,
    tone: "warm",
    icon: "📈",
    label: "Top seller",
    value: "€1.8K",
  },
  {
    id: "margin-left",
    side: "left",
    xMin: 0,
    xMax: 333 / 1280,
    yMin: 0.4,
    yMax: 0.68,
    popupX: 0.07,
    popupY: 0.53,
    tone: "cool",
    icon: "📈",
    label: "Margin",
    value: "34.6%",
  },
  {
    id: "low-stock-left",
    side: "left",
    xMin: 0,
    xMax: 333 / 1280,
    yMin: 0.68,
    yMax: 0.985,
    popupX: 0.08,
    popupY: 0.81,
    tone: "gold",
    icon: "📉",
    label: "Low stock",
    value: "8 items",
  },
  {
    id: "week-right",
    side: "right",
    xMin: 1 - 333 / 1280,
    xMax: 1,
    yMin: 0.14,
    yMax: 0.4,
    popupX: 0.94,
    popupY: 0.28,
    tone: "cool",
    icon: "📈",
    label: "This week",
    value: "+12%",
  },
  {
    id: "expiry-right",
    side: "right",
    xMin: 1 - 333 / 1280,
    xMax: 1,
    yMin: 0.4,
    yMax: 0.68,
    popupX: 0.93,
    popupY: 0.53,
    tone: "gold",
    icon: "📉",
    label: "Expiry risk",
    value: "4 items",
  },
  {
    id: "loss-right",
    side: "right",
    xMin: 1 - 333 / 1280,
    xMax: 1,
    yMin: 0.68,
    yMax: 0.985,
    popupX: 0.92,
    popupY: 0.81,
    tone: "warm",
    icon: "📉",
    label: "Lost sales",
    value: "€420",
  },
];

function Reveal({ as: Tag = "div", className = "", delay = 0, children }) {
  const { ref, isVisible } = useInView({ threshold: 0.16 });

  return (
    <Tag
      ref={ref}
      className={`reveal ${isVisible ? "visible" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

function AnimatedWords({ text, startIndex = 0, emphasis = false }) {
  const words = text.split(" ");

  return (
    <span className={`hero-line ${emphasis ? "emphasis" : ""}`}>
      {words.map((word, index) => {
        const normalized = word.toLowerCase().replace(/[^a-z]/g, "");
        const modeClass = heroWordModes[normalized] ?? "";

        return (
          <span
            key={`${word}-${index}`}
            className={`hero-word ${modeClass}`.trim()}
            style={{ "--word-delay": `${120 + (startIndex + index) * 85}ms` }}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
}

function ExampleVisual({ icon, badge }) {
  return (
    <div className="example-visual" aria-hidden="true">
      <span className="example-badge">{badge}</span>
      <span className="example-emoji">{icon}</span>
    </div>
  );
}

function HeroFlowScene() {
  return (
    <div className="hero-flow-scene hover-rise cursor-reactive" aria-hidden="true">
      <div className="flow-track">
        <div className="flow-track-line" />
        <div className="flow-track-line flow-track-line-accent" />

        <div className="flow-scan-zone">
          <span className="flow-scan-grid" />
          <span className="flow-scan-beam" />
          <span className="flow-scan-pulse" />
          <img className="flow-scan-logo" src="/logo_128.png" alt="" />
        </div>

        <div className="flow-products">
          {heroFlowProducts.map((item, index) => (
            <span
              key={`${item.icon}-${index}`}
              className={`flow-product ${item.tone}`}
              style={{ "--flow-delay": `${index * 1.35}s` }}
            >
              {item.icon}
            </span>
          ))}
        </div>

        <div className="flow-output">
          {heroFlowInsights.map((item, index) => (
            <div
              key={`${item.value}-${index}`}
              className={`flow-chip ${item.tone}`}
              style={{ "--flow-delay": `${index * 1.35}s` }}
            >
              <span className="flow-chip-dot" />
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCards({ items }) {
  return (
    <div className="mini-grid">
      {items.map((item) => (
        <div key={item.label} className="mini-card hover-rise cursor-reactive">
          <span>{item.label}</span>
          <strong className={item.tone === "success" ? "success-text" : ""}>{item.value}</strong>
          {item.note ? <small>{item.note}</small> : null}
        </div>
      ))}
    </div>
  );
}

function ToneBar({ item }) {
  return (
    <div className="bar-row">
      <span>{item.label}</span>
      <div className="bar-track">
        <div className={`bar-fill ${item.tone}`} style={{ width: item.width }} />
      </div>
      <strong>{item.value}</strong>
    </div>
  );
}

function StatusList({ rows }) {
  return (
    <div className="status-list">
      {rows.map((row) => (
        <div key={row.label} className="status-row">
          <span>{row.label}</span>
          <strong className={`pill ${row.tone}`}>{row.status}</strong>
        </div>
      ))}
    </div>
  );
}

function SalesRows({ rows }) {
  return (
    <div className="product-list">
      {rows.map((row) => (
        <div key={row.label} className="product-row">
          <span>{row.label}</span>
          <div className="product-track">
            <div className={`product-fill ${row.tone}`} style={{ width: row.width }} />
          </div>
          <strong>{row.value}</strong>
        </div>
      ))}
    </div>
  );
}

function InsightsNotices({ notices }) {
  return (
    <div className="insight-stack">
      {notices.map((item) => (
        <article key={item.title} className={`insight-card ${item.tone}`}>
          <span className="insight-icon" aria-hidden="true">
            {item.icon}
          </span>
          <div>
            <h4>{item.title}</h4>
            <p>{item.body}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function FeatureMock({ variant, section }) {
  if (variant === "insights") {
    return (
      <div className="screen-card magnetic cursor-reactive">
        <div className="screen-content alt-surface">
          <InsightsNotices notices={section.notices} />
        </div>
      </div>
    );
  }

  return (
    <div className="screen-card magnetic cursor-reactive">
      <div className="screen-content">
        <MetricCards items={section.topCards} />
        <div className="screen-panel cursor-reactive">
          <span className="panel-eyebrow">{section.panelTitle}</span>
          {variant === "sales" ? <SalesRows rows={section.rows} /> : <StatusList rows={section.rows} />}
        </div>
      </div>
    </div>
  );
}

function PricingCard({ plan, freeBadge, monthAfter, featured }) {
  const mutedPrefixes = ["no ", "bez ", "kein ", "без ", "ללא"];

  return (
    <article className={`price-card ${featured ? "featured" : ""} hover-rise cursor-reactive`}>
      {plan.badge ? <span className="price-badge">{plan.badge}</span> : null}
      <span className="price-tier">{plan.tier}</span>
      {plan.price.startsWith("€") ? <span className="free-badge">{freeBadge}</span> : null}
      <div className="price-line">
        <strong>{plan.price}</strong>
        {plan.price.startsWith("€") ? <small>{monthAfter}</small> : null}
      </div>
      <p>{plan.description}</p>
      <ul className="price-list">
        {plan.list.map((item) => (
          <li key={item} className={mutedPrefixes.some((prefix) => item.toLowerCase().startsWith(prefix)) ? "muted" : ""}>
            {item}
          </li>
        ))}
      </ul>
      <a className={`btn ${featured ? "btn-dark pulse-btn cursor-reactive" : "btn-outline cursor-reactive"} full-width`} href={calendlyUrl} target="_blank" rel="noreferrer">
        {plan.cta}
      </a>
    </article>
  );
}

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [activeHeroSignal, setActiveHeroSignal] = useState(null);
  const heroCenterGlowRef = useRef(null);
  const heroSignalClearTimeoutRef = useRef(null);
  const heroSignalRenderIdRef = useRef(0);
  const hero = t("hero", { returnObjects: true });
  const pipeline = t("pipeline", { returnObjects: true });
  const benefits = t("benefits", { returnObjects: true });
  const examples = t("examples", { returnObjects: true });
  const trust = t("trust", { returnObjects: true });
  const trustSources = t("trust.sources", { returnObjects: true });
  const trustResults = t("trust.results", { returnObjects: true });
  const pricing = t("pricing", { returnObjects: true });
  const cta = t("cta", { returnObjects: true });
  const { ref: pipelineRef, isVisible: pipelineVisible } = useInView({ threshold: 0.24 });

  useSeo({
    lang: i18n.language,
    title: t("meta.landingTitle"),
    description: t("meta.landingDescription"),
  });

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const id = location.hash.replace("#", "");
    const node = document.getElementById(id);

    if (!node) {
      return;
    }

    window.setTimeout(() => {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }, [location.hash]);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll(".cursor-reactive"));

    function handleMove(event) {
      const rect = this.getBoundingClientRect();
      this.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      this.style.setProperty("--my", `${event.clientY - rect.top}px`);
    }

    function handleLeave() {
      this.style.removeProperty("--mx");
      this.style.removeProperty("--my");
    }

    nodes.forEach((node) => {
      node.addEventListener("pointermove", handleMove);
      node.addEventListener("pointerleave", handleLeave);
    });

    return () => {
      nodes.forEach((node) => {
        node.removeEventListener("pointermove", handleMove);
        node.removeEventListener("pointerleave", handleLeave);
      });
    };
  }, []);

  useEffect(() => () => {
    if (heroSignalClearTimeoutRef.current) {
      window.clearTimeout(heroSignalClearTimeoutRef.current);
    }
  }, []);

  function showHeroSignal(spot) {
    if (heroSignalClearTimeoutRef.current) {
      window.clearTimeout(heroSignalClearTimeoutRef.current);
      heroSignalClearTimeoutRef.current = null;
    }

    setActiveHeroSignal((current) => {
      if (current && current.id === spot.id && !current.leaving) {
        return current;
      }

      heroSignalRenderIdRef.current += 1;
      return { ...spot, leaving: false, renderId: heroSignalRenderIdRef.current };
    });
  }

  function hideHeroSignal() {
    setActiveHeroSignal((current) => {
      if (!current || current.leaving) {
        return current;
      }

      return { ...current, leaving: true };
    });

    if (heroSignalClearTimeoutRef.current) {
      window.clearTimeout(heroSignalClearTimeoutRef.current);
    }

    heroSignalClearTimeoutRef.current = window.setTimeout(() => {
      setActiveHeroSignal(null);
      heroSignalClearTimeoutRef.current = null;
    }, 240);
  }

  function updateHeroCenterGlow(active, x = 0, y = 0) {
    if (!heroCenterGlowRef.current) {
      return;
    }

    heroCenterGlowRef.current.dataset.active = active ? "true" : "false";

    if (active) {
      heroCenterGlowRef.current.style.setProperty("--mx", `${x}px`);
      heroCenterGlowRef.current.style.setProperty("--my", `${y}px`);
    }
  }

  function handleHeroPointerMove(event) {
    if (window.innerWidth <= 1080) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    const x = localX / rect.width;
    const y = localY / rect.height;
    const centerZoneWidth = Math.min(680, rect.width);
    const centerZoneHeight = Math.min(500, rect.height);
    const centerZoneLeft = (rect.width - centerZoneWidth) / 2;
    const centerZoneTop = (rect.height - centerZoneHeight) / 2;
    const zoneCenterX = centerZoneLeft + centerZoneWidth / 2;
    const zoneCenterY = centerZoneTop + centerZoneHeight / 2;
    const ellipseDx = (localX - zoneCenterX) / (centerZoneWidth / 2);
    const ellipseDy = (localY - zoneCenterY) / (centerZoneHeight / 2);
    const insideCenterZone = ellipseDx * ellipseDx + ellipseDy * ellipseDy <= 1;

    if (insideCenterZone) {
      updateHeroCenterGlow(true, localX - centerZoneLeft, localY - centerZoneTop);
    } else {
      updateHeroCenterGlow(false);
    }

    const hoveredSpot = heroShelfHotspots.find(
      (spot) => x >= spot.xMin && x <= spot.xMax && y >= spot.yMin && y <= spot.yMax,
    );

    if (!hoveredSpot) {
      hideHeroSignal();
      return;
    }

    showHeroSignal(hoveredSpot);
  }

  return (
    <>
      <section
        className="hero-section"
        onPointerMove={handleHeroPointerMove}
        onPointerLeave={() => {
          hideHeroSignal();
          updateHeroCenterGlow(false);
        }}
      >
        <div className="hero-hover-layer desktop-only" aria-hidden="true">
          <div ref={heroCenterGlowRef} className="hero-center-cursor-zone" data-active="false" />
          {activeHeroSignal ? (
            <div
              key={activeHeroSignal.renderId}
              className={`hero-signal ${activeHeroSignal.side}`}
              style={{ left: `${activeHeroSignal.popupX * 100}%`, top: `${activeHeroSignal.popupY * 100}%` }}
            >
              <div className={`hero-signal-card ${activeHeroSignal.tone} ${activeHeroSignal.leaving ? "leaving" : ""}`}>
                <span className="hero-signal-icon">{activeHeroSignal.icon}</span>
                <span className="hero-signal-copy">
                  <small>{activeHeroSignal.label}</small>
                  <strong>{activeHeroSignal.value}</strong>
                </span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="hero-copy">
          <span className="eyebrow hero-load hero-delay-0">{hero.eyebrow}</span>
          <div className="hero-title-shell hero-load hero-delay-1">
            <h1 className="hero-title">
              <AnimatedWords text={hero.titleStart} startIndex={0} />
              {hero.titleMiddle ? (
                <AnimatedWords text={hero.titleMiddle} startIndex={hero.titleStart.split(" ").length} emphasis />
              ) : null}
              <AnimatedWords
                text={hero.titleAccent}
                startIndex={hero.titleMiddle ? hero.titleStart.split(" ").length + hero.titleMiddle.split(" ").length : 6}
                emphasis
              />
            </h1>
          </div>
          <p className="hero-sub hero-load hero-delay-2">{hero.subtitle}</p>
          <div className="hero-actions hero-load hero-delay-3">
            <a className="btn btn-dark pulse-btn cursor-reactive" href={calendlyUrl} target="_blank" rel="noreferrer">
              {t("common.bookDemo")}
            </a>
            <a className="btn btn-outline cursor-reactive" href="#how-it-works">
              {t("common.seeHowItWorks")}
            </a>
          </div>
        </div>

      </section>

      <div className="hero-showcase-stack">
        <div className="hero-flow-wrap hero-load hero-delay-4">
          <HeroFlowScene />
        </div>

        <div className="hero-dashboard-wrap">
          <div className="hero-dashboard hero-load hero-delay-5 magnetic cursor-reactive">
            <div className="hero-grid">
              <div className="hero-left">
                <MetricCards items={hero.metrics} />
                <div className="hero-chart-card hover-rise cursor-reactive">
                  <span className="panel-eyebrow">{hero.chartTitle}</span>
                  <div className="hero-bars">
                    {hero.categories.map((item) => (
                      <ToneBar key={item.label} item={item} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="hero-stock-card hover-rise cursor-reactive">
                <span className="panel-eyebrow">{hero.stockoutTitle}</span>
                <div className="stockout-list">
                  {hero.stockouts.map((item) => (
                    <div key={item.name} className="stockout-row">
                      <div>
                        <h4>{item.name}</h4>
                        <p>{item.meta}</p>
                      </div>
                      <span className={`pill ${item.tone}`}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section section-soft" id="how-it-works">
        <div className="container">
          <Reveal className="eyebrow">{pipeline.eyebrow}</Reveal>
          <Reveal as="h2" className="section-title" delay={80}>
            {pipeline.titleStart}
            <br />
            <em>{pipeline.titleAccent}</em>
          </Reveal>
          <Reveal as="p" className="section-lead" delay={140}>
            {pipeline.lead}
          </Reveal>

          <div ref={pipelineRef} className={`pipeline-wrap ${pipelineVisible ? "visible" : ""}`}>
            <div className={`pipeline-line ${pipelineVisible ? "animated" : ""}`} />
            <div className={`pipeline-dots ${pipelineVisible ? "animated" : ""}`}>
              <span />
              <span />
              <span />
            </div>
            <div className="pipeline-steps">
              {pipeline.steps.map((step, index) => (
                <article
                  key={step.title}
                  className={`pipe-step ${pipelineVisible ? "visible" : ""}`}
                  style={{ transitionDelay: `${index * 140}ms` }}
                >
                  <div className="pipe-icon">{step.icon}</div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="benefits">
        <div className="container">
          <div className="feature-stack">
            <Reveal className="feature-row" delay={60}>
              <div className="feature-copy">
                <span className="feature-tag">{benefits.inventory.tag}</span>
                <h3>
                  {benefits.inventory.titleStart}
                  <br />
                  <em>{benefits.inventory.titleAccent}</em>
                </h3>
                <p>{benefits.inventory.body}</p>
                <ul className="check-list">
                  {benefits.inventory.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <FeatureMock variant="inventory" section={benefits.inventory} />
            </Reveal>

            <Reveal className="feature-row flip" delay={120}>
              <div className="feature-copy">
                <span className="feature-tag">{benefits.sales.tag}</span>
                <h3>
                  {benefits.sales.titleStart}
                  <br />
                  <em>{benefits.sales.titleAccent}</em>
                </h3>
                <p>{benefits.sales.body}</p>
                <ul className="check-list">
                  {benefits.sales.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <FeatureMock variant="sales" section={benefits.sales} />
            </Reveal>

            <Reveal className="feature-row" delay={180}>
              <div className="feature-copy">
                <span className="feature-tag">{benefits.insights.tag}</span>
                <h3>
                  {benefits.insights.titleStart}
                  <br />
                  <em>{benefits.insights.titleAccent}</em>
                </h3>
                <p>{benefits.insights.body}</p>
                {benefits.insights.list?.length ? (
                  <ul className="check-list">
                    {benefits.insights.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <FeatureMock variant="insights" section={benefits.insights} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section-soft" id="examples">
        <div className="container">
          <Reveal className="eyebrow">{examples.eyebrow}</Reveal>
          <Reveal as="h2" className="section-title" delay={80}>
            {examples.titleStart}
            <br />
            <em>{examples.titleAccent}</em>
          </Reveal>
          {examples.lead ? (
            <Reveal as="p" className="section-lead" delay={140}>
              {examples.lead}
            </Reveal>
          ) : null}
          <div className="examples-grid">
            {examples.cards.map((card, index) => (
              <Reveal key={card.title} className="example-card hover-rise cursor-reactive" delay={index * 90}>
                <div className="example-top">
                  <span className="example-index">0{index + 1}</span>
                  <ExampleVisual icon={card.icon} badge={card.badge} />
                </div>
                <h3>{card.title}</h3>
                {card.body ? <p>{card.body}</p> : null}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section trust-section">
        <div className="container">
          <div className="setup-shell">
            <div className="setup-copy">
              <Reveal className="eyebrow">{trust.eyebrow}</Reveal>
              <Reveal as="h2" className="section-title trust-title" delay={80}>
                {trust.titleStart}
                <br />
                <em>{trust.titleAccent}</em>
              </Reveal>
              <Reveal as="p" className="section-lead trust-lead" delay={140}>
                {trust.lead}
              </Reveal>
              <Reveal className="setup-note" delay={200}>
                <span className="trust-check" aria-hidden="true">
                  ✓
                </span>
                <span>{trust.note}</span>
              </Reveal>
            </div>
            <Reveal className="setup-panel setup-board cursor-reactive hover-rise" delay={180}>
              <div className="setup-board-top">
                <span className="setup-panel-label">{trust.sourcesTitle}</span>
                <div className="setup-source-pills">
                  {trustSources.map((item) => (
                    <div key={item.title} className="setup-source-pill">
                      <span className="setup-source-icon compact" aria-hidden="true">
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="setup-board-divider" />

              <div className="setup-board-bottom">
                <span className="setup-panel-label">{trust.resultsTitle}</span>
                <div className="setup-result-list">
                  {trustResults.map((item, index) => (
                    <article key={item} className="setup-result-item">
                      <span className="setup-result-index">0{index + 1}</span>
                      <p>{item}</p>
                    </article>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section pricing-section" id="pricing">
        <div className="container">
          <Reveal className="eyebrow">{pricing.eyebrow}</Reveal>
          <Reveal as="h2" className="section-title" delay={80}>
            {pricing.titleStart}
            <br />
            <em>{pricing.titleAccent}</em>
          </Reveal>
          <Reveal as="p" className="section-lead" delay={140}>
            {pricing.lead}
          </Reveal>
          <div className="price-grid">
            {pricing.plans.map((plan) => (
              <Reveal key={plan.tier} delay={100} className="price-column">
                <PricingCard
                  plan={plan}
                  featured={plan.featured}
                  freeBadge={t("common.freeBadge")}
                  monthAfter={t("common.monthAfter")}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="cta-orb" aria-hidden="true" />
        <div className="container cta-inner">
          <Reveal className="eyebrow">{cta.eyebrow}</Reveal>
          <Reveal as="h2" className="section-title light" delay={80}>
            {cta.titleStart}
            <br />
            <em>{cta.titleAccent}</em>
          </Reveal>
          <Reveal as="p" className="section-lead light" delay={140}>
            {cta.body}
          </Reveal>
          <Reveal className="hero-actions center" delay={220}>
            <a className="btn btn-white pulse-btn cursor-reactive" href={calendlyUrl} target="_blank" rel="noreferrer">
              {t("common.bookDemo")}
            </a>
            <a className="btn btn-ghost cursor-reactive" href={`mailto:${t("common.email")}`}>
              {t("common.email")}
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}

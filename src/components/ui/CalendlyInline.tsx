import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

interface CalendlyInlineProps {
  url: string;
  height?: number;
}

export default function CalendlyInline({ url, height = 760 }: CalendlyInlineProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scriptSrc = "https://assets.calendly.com/assets/external/widget.js";
    const styleHref = "https://assets.calendly.com/assets/external/widget.css";

    const ensureStylesheet = () => {
      const existing = document.querySelector<HTMLLinkElement>(`link[href="${styleHref}"]`);
      if (!existing) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = styleHref;
        document.head.appendChild(link);
      }
    };

    const initWidget = () => {
      if (!window.Calendly || !containerRef.current) return;
      containerRef.current.innerHTML = "";
      window.Calendly.initInlineWidget({
        url,
        parentElement: containerRef.current,
      });
    };

    ensureStylesheet();

    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${scriptSrc}"]`);

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      script.onload = initWidget;
      document.body.appendChild(script);
    } else {
      if (window.Calendly) {
        initWidget();
      } else {
        existingScript.addEventListener("load", initWidget, { once: true });
      }
    }

    return () => {
      if (existingScript) {
        existingScript.removeEventListener("load", initWidget);
      }
    };
  }, [url]);

  return (
    <div
      ref={containerRef}
      className="calendly-inline-widget"
      data-url={url}
      style={{ minWidth: "320px", height }}
    />
  );
}

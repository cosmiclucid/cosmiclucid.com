import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Item = { id: string; label: string; href?: string };
type Props = {
  items: Item[];
  className?: string;
  activeIndex?: number;
  initialActive?: number;
  onSelect?: (index: number, item: Item) => void;
  onChange?: (index: number, item: Item) => void;
};

export function GlowNav({
  items,
  className = "",
  activeIndex,
  initialActive = 0,
  onSelect,
  onChange,
}: Props) {
  const navRef = useRef<HTMLElement>(null);
  const [internalActive, setInternalActive] = useState(initialActive);

  const currentActive = activeIndex ?? internalActive;

  const syncIndicator = () => {
    const nav = navRef.current;
    if (!nav) return;
    const ul = nav.querySelector("ul");
    if (!ul) return;
    if (
      currentActive == null ||
      currentActive < 0 ||
      currentActive >= ul.children.length
    ) {
      return;
    }

    const li = ul.children[currentActive] as HTMLElement;
    if (!li) return;

    const width = li.offsetWidth;
    const left = li.getBoundingClientRect().left;
    const navLeft = ul.getBoundingClientRect().left;
    const offsetLeft = left - navLeft;

    nav.style.setProperty("--after-bg-position", String(offsetLeft));
    nav.style.setProperty(
      "--after-radial-bg-position",
      String(offsetLeft + width / 2),
    );
    nav.style.setProperty("--after-bg-width", String(width));
    nav.style.setProperty("--after-bg-opacity", "22");
    nav.style.setProperty("--after-shadow-offset", "18");
  };

  useLayoutEffect(() => {
    syncIndicator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentActive, items.length]);

  useEffect(() => {
    const onResize = () => syncIndicator();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentActive, items.length]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const onMove = (e: MouseEvent) => {
      const rect = nav.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      nav.style.setProperty("--tilt-bg-x", String((y / rect.height) * 6));
      nav.style.setProperty("--tilt-bg-y", String(-(x / rect.width) * 6));
    };

    nav.addEventListener("mousemove", onMove);
    return () => nav.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    if (activeIndex === undefined) {
      setInternalActive(initialActive);
    }
  }, [initialActive, activeIndex]);

  const combinedClassName = className
    ? `glow-nav ${className}`
    : "glow-nav";

  return (
    <nav ref={navRef} className={combinedClassName}>
      <ul>
        {items.map((it, i) => (
          <li
            key={it.id}
            className={i === currentActive ? "active" : ""}
            style={{ width: "auto", flex: "1 1 auto", minWidth: 0 }}
          >
            <a
              href={it.href ?? "#"}
              onClick={(e) => {
                e.preventDefault();
                if (activeIndex === undefined) {
                  setInternalActive(i);
                }
                onChange?.(i, it);
                onSelect?.(i, it);
              }}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default GlowNav;

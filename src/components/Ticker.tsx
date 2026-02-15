"use client";

import { useRef, useEffect, useState, memo } from "react";

type TickerProps = {
  items: string[];
};

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

const SPEED = 60; // pixels per second

function TickerInner({ items }: TickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  const display = items.map((item) => truncate(item, 50));
  const separator = "　　　";
  const text = display.join(separator) + separator;

  useEffect(() => {
    if (innerRef.current) {
      setContentWidth(innerRef.current.scrollWidth / 2);
    }
  }, [text]);

  if (items.length === 0) return null;

  const duration = contentWidth > 0 ? contentWidth / SPEED : 30;

  return (
    <div className="py-3" style={{ backgroundColor: "#0a1a3a" }}>
      <div className="overflow-hidden" ref={containerRef}>
        <div
          ref={innerRef}
          className="inline-block whitespace-nowrap text-lg text-white"
          style={
            contentWidth > 0
              ? {
                  animation: `ticker ${duration}s linear infinite`,
                }
              : undefined
          }
        >
          <span>{text}</span>
          <span>{text}</span>
        </div>
      </div>
    </div>
  );
}

// Prevent re-render from parent (MainDisplay state changes)
const Ticker = memo(TickerInner, (prev, next) => {
  if (prev.items.length !== next.items.length) return false;
  return prev.items.every((item, i) => item === next.items[i]);
});

export default Ticker;

"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type Post = {
  id: string;
  name: string;
  title: string | null;
  body: string;
};

const INTERVAL_MS = 15000;

export default function MainDisplay({ posts }: { posts: Post[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const shownIds = useRef(new Set<string>());

  const pickNext = useCallback(() => {
    if (posts.length === 0) return;

    const unshown = posts.filter((p) => !shownIds.current.has(p.id));
    if (unshown.length > 0) {
      const idx = posts.indexOf(unshown[0]);
      shownIds.current.add(unshown[0].id);
      return idx;
    }

    shownIds.current.clear();
    const idx = Math.floor(Math.random() * posts.length);
    shownIds.current.add(posts[idx].id);
    return idx;
  }, [posts]);

  useEffect(() => {
    if (posts.length === 0) return;

    const next = pickNext();
    if (next !== undefined) setCurrentIndex(next);

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        const next = pickNext();
        if (next !== undefined) setCurrentIndex(next);
        setVisible(true);
      }, 500);
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, [posts, pickNext]);

  if (posts.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-3xl text-gray-700/50">投稿を待っています...</p>
      </div>
    );
  }

  const current = posts[currentIndex];

  return (
    <div className="flex flex-1 items-center justify-center px-16">
      <div
        className="w-full max-w-4xl rounded-2xl px-14 py-10 shadow-xl transition-opacity duration-500"
        style={{ opacity: visible ? 1 : 0, backgroundColor: "#F4F6F8" }}
      >
        {/* Pen name */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white" style={{ backgroundColor: "#4ecfff" }}>
            {current?.name?.charAt(0)}
          </div>
          <p className="text-3xl font-extrabold text-gray-800">
            ラジオネーム：{current?.name}
          </p>
        </div>

        {/* Title */}
        {current?.title && (
          <p className="mb-6 text-2xl font-bold text-gray-500">
            {current.title}
          </p>
        )}

        {/* Body */}
        <p className="whitespace-pre-wrap text-[2rem] leading-[1.8] text-gray-800">
          {current?.body}
        </p>
      </div>
    </div>
  );
}

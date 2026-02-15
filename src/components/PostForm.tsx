"use client";

import { useState, useEffect } from "react";

const MAX_NAME_LENGTH = 20;
const MAX_TITLE_LENGTH = 50;
const MAX_BODY_LENGTH = 300;
const COOLDOWN_MS = 5000;
const COOLDOWN_KEY = "yarakashi_last_post";

export default function PostForm() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    const last = localStorage.getItem(COOLDOWN_KEY);
    if (last && Date.now() - Number(last) < COOLDOWN_MS) {
      setCooldown(true);
      const remaining = COOLDOWN_MS - (Date.now() - Number(last));
      const timer = setTimeout(() => setCooldown(false), remaining);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim() || cooldown) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          title: title.trim() || undefined,
          body: body.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "投稿に失敗しました");
      }

      localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      setCooldown(true);
      setTimeout(() => setCooldown(false), COOLDOWN_MS);
      setBody("");
      setTitle("");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "投稿に失敗しました");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Pen name */}
      <div>
        <label className="mb-1.5 block text-sm font-bold text-gray-700">
          ペンネーム
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            if (e.target.value.length <= MAX_NAME_LENGTH) {
              setName(e.target.value);
            }
          }}
          placeholder="例：匿名のやらかしマン"
          className="w-full rounded-xl border-2 border-gray-200 bg-white p-3.5 text-base transition focus:border-sky-400 focus:outline-none"
        />
        <p className="mt-1 text-right text-xs text-gray-400">
          {name.length} / {MAX_NAME_LENGTH}
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="mb-1.5 block text-sm font-bold text-gray-700">
          タイトル
          <span className="ml-1 font-normal text-gray-400">（任意）</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            if (e.target.value.length <= MAX_TITLE_LENGTH) {
              setTitle(e.target.value);
            }
          }}
          placeholder="例：忘れ物の王様"
          className="w-full rounded-xl border-2 border-gray-200 bg-white p-3.5 text-base transition focus:border-sky-400 focus:outline-none"
        />
        <p className="mt-1 text-right text-xs text-gray-400">
          {title.length} / {MAX_TITLE_LENGTH}
        </p>
      </div>

      {/* Body */}
      <div>
        <label className="mb-1.5 block text-sm font-bold text-gray-700">
          エピソード
        </label>
        <textarea
          value={body}
          onChange={(e) => {
            if (e.target.value.length <= MAX_BODY_LENGTH) {
              setBody(e.target.value);
            }
          }}
          placeholder="あなたのやらかしを教えてください..."
          rows={6}
          className="w-full resize-none rounded-xl border-2 border-gray-200 bg-white p-3.5 text-base transition focus:border-sky-400 focus:outline-none"
        />
        <p className="mt-1 text-right text-xs text-gray-400">
          {body.length} / {MAX_BODY_LENGTH}
        </p>
      </div>

      {/* Status message */}
      {status === "done" && (
        <p className="rounded-lg bg-green-50 py-2 text-center text-sm font-medium text-green-600">
          投稿しました！
        </p>
      )}
      {status === "error" && (
        <p className="rounded-lg bg-red-50 py-2 text-center text-sm font-medium text-red-600">
          {errorMsg}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!name.trim() || !body.trim() || status === "sending" || cooldown}
        className="rounded-xl px-6 py-4 text-lg font-bold text-white shadow-md transition active:scale-95 disabled:opacity-40"
        style={{ backgroundColor: "#4ecfff" }}
      >
        {status === "sending"
          ? "送信中..."
          : cooldown
            ? "しばらくお待ちください"
            : "投稿する"}
      </button>

      <p className="text-center text-xs text-gray-400">
        ※ 投稿内容はモニターに表示されます。個人情報は含めないでください。
      </p>
    </form>
  );
}

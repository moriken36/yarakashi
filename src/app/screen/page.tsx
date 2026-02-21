"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/lib/supabase";
import MainDisplay from "@/components/MainDisplay";
import Ticker from "@/components/Ticker";

type Post = {
  id: string;
  name: string;
  title: string | null;
  body: string;
  ticker: string;
  created_at: string;
};

export default function ScreenPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, name, title, body, ticker, created_at")
        .order("created_at", { ascending: false })
        .limit(100);

      if (data) setPosts(data);
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("posts-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          const newPost = payload.new as Post;
          setPosts((prev) => [newPost, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const postUrl = origin ? `${origin}/m/post` : "";

  return (
    <div className="flex h-dvh flex-col" style={{ backgroundColor: "#4ecfff" }}>
      {/* Header */}
      <div className="flex items-center justify-between py-4 pl-4 pr-10">
        <div className="flex items-center gap-1">
          <Image
            src="/logo.png"
            alt="やらかし"
            width={100}
            height={100}
            className="object-contain"
          />
          <div>
            <h1 className="text-5xl font-extrabold tracking-wider text-white">
              やらかしちゃった展
            </h1>
            <p className="text-base tracking-wide text-white/60">
              — みんなの黒歴史、放送中 —
            </p>
          </div>
        </div>
        {postUrl && (
          <div className="flex flex-col items-center">
            <div className="rounded-2xl bg-white p-3 shadow-lg">
              <QRCodeSVG value={postUrl} size={120} />
            </div>
            <div className="relative mt-2 rounded-lg bg-white px-4 py-1.5 shadow">
              <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white" />
              <p className="text-sm font-bold text-gray-700">投稿はこちら</p>
            </div>
          </div>
        )}
      </div>

      {/* Main display */}
      <MainDisplay
        posts={posts.map((p) => ({ id: p.id, name: p.name, title: p.title, body: p.body }))}
      />

      {/* Bottom area: character + ticker */}
      <div className="relative">
        <div className="absolute bottom-full right-4 z-10 opacity-70">
          <Image
            src="/character.png"
            alt="キャラクター"
            width={200}
            height={200}
            className="object-contain"
          />
        </div>
        <Ticker items={posts.map((p) => `${p.name}：${p.body}`)} />
      </div>
    </div>
  );
}

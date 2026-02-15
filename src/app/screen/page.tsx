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
      <div className="flex items-center justify-between px-10 py-5">
        <div className="flex items-center gap-1">
          <Image
            src="/logo.png"
            alt="やらかし"
            width={70}
            height={70}
            className="object-contain"
          />
          <div>
            <h1 className="text-3xl font-extrabold tracking-wider text-white">
              やらかしちゃった展
            </h1>
            <p className="text-sm tracking-wide text-white/60">
              — みんなの黒歴史、放送中 —
            </p>
          </div>
        </div>
        {postUrl && (
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white p-2.5 shadow-lg">
              <QRCodeSVG value={postUrl} size={72} />
            </div>
            <p className="text-sm font-medium text-white/80">
              投稿はこちら
            </p>
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

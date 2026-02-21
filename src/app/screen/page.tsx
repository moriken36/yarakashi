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
    <div className="relative flex h-dvh flex-col overflow-hidden" style={{ backgroundColor: "#4ecfff" }}>
      {/* Background illustrations */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Train - middle left */}
        <Image
          src="/illust-train.png"
          alt=""
          width={200}
          height={150}
          className="absolute left-2 top-[30%] object-contain opacity-20"
        />
        {/* Furniture/earthquake - top center */}
        <Image
          src="/illust-furniture.png"
          alt=""
          width={200}
          height={180}
          className="absolute right-1/3 top-6 object-contain opacity-15"
        />
        {/* Car - left side, middle area */}
        <Image
          src="/illust-car.png"
          alt=""
          width={260}
          height={170}
          className="absolute bottom-40 left-4 object-contain opacity-25"
        />
        {/* Bicycle - bottom right area */}
        <Image
          src="/illust-bicycle.png"
          alt=""
          width={180}
          height={140}
          className="absolute bottom-28 right-[22%] object-contain opacity-20"
        />
        {/* Sleeping - bottom center-left */}
        <Image
          src="/illust-sleep.png"
          alt=""
          width={240}
          height={150}
          className="absolute bottom-20 left-[30%] object-contain opacity-20"
        />
        {/* Toilet - right middle */}
        <Image
          src="/illust-toilet.png"
          alt=""
          width={150}
          height={190}
          className="absolute right-4 top-[35%] object-contain opacity-20"
        />
        {/* Original character - bottom right */}
        <Image
          src="/character.png"
          alt=""
          width={200}
          height={200}
          className="absolute bottom-12 right-4 object-contain opacity-40"
        />
      </div>

      {/* Header - title/logo */}
      <div className="relative z-10 flex items-center gap-1 pt-7 pb-2 pl-4">
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

      {/* QR code - fixed top right */}
      {postUrl && (
        <div className="absolute right-6 top-4 z-20 flex flex-col items-center">
          <div className="rounded-2xl bg-white p-3 shadow-lg">
            <QRCodeSVG value={postUrl} size={120} />
          </div>
          <div className="relative mt-2 rounded-lg bg-white px-4 py-1.5 shadow">
            <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white" />
            <p className="text-sm font-bold text-gray-700">投稿はこちら</p>
          </div>
        </div>
      )}

      {/* Main display */}
      <div className="relative z-10 flex flex-1">
        <MainDisplay
          posts={posts.map((p) => ({ id: p.id, name: p.name, title: p.title, body: p.body }))}
        />
      </div>

      {/* Ticker */}
      <div className="relative z-10">
        <Ticker items={posts.map((p) => `${p.name}：${p.body}`)} />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";
import Link from "next/link";

type Post = {
  id: string;
  name: string;
  title: string | null;
  body: string;
  created_at: string;
};

const PAGE_SIZE = 20;

export default function AllPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchPosts = useCallback(async (pageNum: number) => {
    setLoading(true);
    const from = pageNum * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data } = await supabase
      .from("posts")
      .select("id, name, title, body, created_at")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (data) {
      setPosts((prev) => (pageNum === 0 ? data : [...prev, ...data]));
      setHasMore(data.length === PAGE_SIZE);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts(0);
  }, [fetchPosts]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPosts(next);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-extrabold text-gray-800">
        みんなのやらかし
      </h2>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          name={post.name}
          title={post.title}
          body={post.body}
          createdAt={post.created_at}
        />
      ))}
      {loading && (
        <p className="py-4 text-center text-sm text-gray-400">読み込み中...</p>
      )}
      {!loading && hasMore && posts.length > 0 && (
        <button
          onClick={loadMore}
          className="rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-500 transition active:scale-95"
        >
          もっと見る
        </button>
      )}
      {!loading && posts.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-400">
          まだ投稿がありません
        </p>
      )}
      <Link
        href="/m"
        className="py-2 text-center text-sm font-medium text-gray-400 transition hover:text-gray-600"
      >
        トップに戻る
      </Link>
    </div>
  );
}

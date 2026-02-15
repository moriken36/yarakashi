import PostForm from "@/components/PostForm";
import Link from "next/link";

export default function PostPage() {
  return (
    <div className="flex flex-col gap-6">
      <PostForm />
      <Link
        href="/m"
        className="text-center text-sm font-medium text-gray-400 transition hover:text-gray-600"
      >
        トップに戻る
      </Link>
    </div>
  );
}

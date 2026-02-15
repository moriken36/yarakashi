import Link from "next/link";

export default function MobileTop() {
  return (
    <div className="flex flex-col items-center gap-8 pt-10">
      <div className="text-center">
        <p className="text-lg font-bold text-gray-800">
          あなたの「やらかし」を
        </p>
        <p className="text-lg font-bold text-gray-800">
          みんなに共有しよう！
        </p>
        <p className="mt-2 text-sm text-gray-400">
          — みんなの黒歴史、放送中 —
        </p>
      </div>
      <div className="flex w-full flex-col gap-4">
        <Link
          href="/m/post"
          className="w-full rounded-xl px-6 py-4 text-center text-lg font-bold text-white shadow-md transition active:scale-95"
          style={{ backgroundColor: "#4ecfff" }}
        >
          投稿する
        </Link>
        <Link
          href="/m/all"
          className="w-full rounded-xl border-2 border-gray-200 bg-white px-6 py-4 text-center text-lg font-bold text-gray-600 shadow-sm transition active:scale-95"
        >
          みんなのやらかしを見る
        </Link>
      </div>
    </div>
  );
}

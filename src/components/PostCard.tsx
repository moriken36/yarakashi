type PostCardProps = {
  name: string;
  title: string | null;
  body: string;
  createdAt: string;
};

export default function PostCard({ name, title, body, createdAt }: PostCardProps) {
  const date = new Date(createdAt);
  const timeStr = date.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2.5">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: "#4ecfff" }}
        >
          {name.charAt(0)}
        </div>
        <p className="text-sm font-bold text-gray-800">{name}</p>
        <p className="ml-auto text-xs text-gray-400">{timeStr}</p>
      </div>
      {title && (
        <p className="mt-3 text-sm font-bold text-gray-700">{title}</p>
      )}
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
        {body}
      </p>
    </div>
  );
}

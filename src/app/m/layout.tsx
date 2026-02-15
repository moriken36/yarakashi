import Image from "next/image";

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-dvh max-w-md" style={{ backgroundColor: "#f0f8ff" }}>
      <header className="sticky top-0 z-10 px-4 py-4" style={{ backgroundColor: "#4ecfff" }}>
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/logo.png"
            alt="やらかし"
            width={36}
            height={36}
            className="object-contain"
          />
          <h1 className="text-xl font-extrabold tracking-wider text-white">
            やらかしちゃった展
          </h1>
        </div>
      </header>
      <main className="p-5">{children}</main>
    </div>
  );
}

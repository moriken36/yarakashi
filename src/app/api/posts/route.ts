import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { name, title, body } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "ペンネームが必要です" }, { status: 400 });
    }

    if (!body || typeof body !== "string") {
      return NextResponse.json({ error: "エピソードが必要です" }, { status: 400 });
    }

    const cleanedName = name.replace(/[\n\r]/g, "").replace(/[\x00-\x1f\x7f]/g, "").trim();
    const cleanedTitle = typeof title === "string"
      ? title.replace(/[\n\r]/g, "").replace(/[\x00-\x1f\x7f]/g, "").trim()
      : "";
    const cleanedBody = body.replace(/[\n\r]/g, " ").replace(/[\x00-\x1f\x7f]/g, "").trim();

    if (cleanedName.length === 0) {
      return NextResponse.json({ error: "ペンネームが空です" }, { status: 400 });
    }

    if (cleanedName.length > 20) {
      return NextResponse.json({ error: "ペンネームは20文字以内で入力してください" }, { status: 400 });
    }

    if (cleanedTitle.length > 50) {
      return NextResponse.json({ error: "タイトルは50文字以内で入力してください" }, { status: 400 });
    }

    if (cleanedBody.length === 0) {
      return NextResponse.json({ error: "エピソードが空です" }, { status: 400 });
    }

    if (cleanedBody.length > 300) {
      return NextResponse.json({ error: "エピソードは300文字以内で入力してください" }, { status: 400 });
    }

    // Generate ticker: "ペンネーム: エピソード" truncated to 40 chars
    const tickerFull = `${cleanedName}：${cleanedBody}`;
    const ticker = tickerFull.length > 40 ? tickerFull.slice(0, 40) + "..." : tickerFull;

    const { data, error } = await supabase
      .from("posts")
      .insert({
        name: cleanedName,
        title: cleanedTitle || null,
        body: cleanedBody,
        ticker,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "投稿に失敗しました" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }
}

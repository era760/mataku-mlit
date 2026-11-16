import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const defaultNewsList = [
  {
    id: 1,
    tag: "重要",
    title: "衆議院解散！",
    date: "2026-10-18",
    content: "衆議院が解散したため、国土交通大臣が変わります。",
  },
  {
    id: 2,
    tag: "重要",
    title: "マタク鯖国土交通省ホームページが作られました。",
    date: "2026-10-17",
    content: "マタク鯖国土交通省の公式ホームページを開設しました。",
  },
  {
    id: 3,
    tag: "お知らせ",
    title: "マタク鯖国土交通省が建てられました。",
    date: "2026-10-16",
    content: "マタク鯖国土交通省が設立されました。",
  },
];

function isAuthorized(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const expectedToken = crypto
    .createHash("sha256")
    .update(adminPassword + "_mataku_mlit_salt")
    .digest("hex");

  return token === expectedToken;
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 1. 記事一覧取得 (GET)
  if (req.method === "GET") {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("news")
          .select("*")
          .order("date", { ascending: false });

        if (error) {
          console.error("Supabase select error:", error);
          return res.status(200).json(defaultNewsList);
        }

        return res.status(200).json(data || defaultNewsList);
      } catch (e) {
        console.error("Supabase fetch exception:", e);
        return res.status(200).json(defaultNewsList);
      }
    } else {
      // Supabase 未設定の場合はデフォルトニュースを返す
      return res.status(200).json(defaultNewsList);
    }
  }

  // 2. 記事の追加・更新・削除には管理者認証が必要
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "認証が必要です（未ログインまたはセッション切れ）。" });
  }

  if (!isSupabaseConfigured) {
    return res.status(503).json({
      error: "Supabase の環境変数がサーバーに設定されていません。",
    });
  }

  // 3. 記事の追加 (POST)
  if (req.method === "POST") {
    try {
      const { tag, title, date, content } = req.body || {};
      if (!title || !date || !content) {
        return res.status(400).json({ error: "必須項目が不足しています。" });
      }

      const { data, error } = await supabase
        .from("news")
        .insert([{ tag: tag || "お知らせ", title, date, content }])
        .select();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({ success: true, item: data?.[0] });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // 4. 記事の更新 (PUT)
  if (req.method === "PUT") {
    try {
      const { id, tag, title, date, content } = req.body || {};
      if (!id || !title || !date || !content) {
        return res.status(400).json({ error: "必須項目が不足しています。" });
      }

      const { data, error } = await supabase
        .from("news")
        .update({ tag, title, date, content })
        .eq("id", id)
        .select();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true, item: data?.[0] });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // 5. 記事の削除 (DELETE)
  if (req.method === "DELETE") {
    try {
      const id = req.query.id || req.body?.id;
      if (!id) {
        return res.status(400).json({ error: "削除対象のIDが指定されていません。" });
      }

      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

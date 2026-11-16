import crypto from "crypto";

export default async function handler(req, res) {
  // CORS & OPTIONS 対応
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { password } = req.body || {};
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (!password) {
      return res.status(400).json({ error: "パスワードを入力してください。" });
    }

    if (password === adminPassword) {
      // パスワードから安全な検証用トークンを生成
      const token = crypto
        .createHash("sha256")
        .update(adminPassword + "_mataku_mlit_salt")
        .digest("hex");

      return res.status(200).json({
        success: true,
        token,
      });
    } else {
      return res.status(401).json({
        success: false,
        error: "パスワードが正しくありません。",
      });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

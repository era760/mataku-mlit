import crypto from "crypto";

export default async function handler(req, res) {
  // CORS & OPTIONS 対応
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    return res.status(401).json({ valid: false, error: "トークンが存在しません。" });
  }

  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const expectedToken = crypto
    .createHash("sha256")
    .update(adminPassword + "_mataku_mlit_salt")
    .digest("hex");

  if (token === expectedToken) {
    return res.status(200).json({ valid: true });
  } else {
    return res.status(401).json({ valid: false, error: "無効なトークンです。" });
  }
}

import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "TOKEN TIDAK ADA" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "SECRET_KEY_POS");
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "TOKEN INVALID" });
  }
};

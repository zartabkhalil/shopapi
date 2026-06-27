import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/jwt.types";

export default class JwtService {
  generateAccessToken(payload: JwtPayload) {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) throw new Error("JWT_ACCESS_SECRET is not set");
    return jwt.sign(payload, secret, { expiresIn: "15m" });
  }

  verifyAccessToken(token: string) {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) throw new Error("JWT_ACCESS_SECRET is not set");
    return jwt.verify(token, secret);
  }

  generateRefreshToken(payload: JwtPayload) {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error("JWT_REFRESH_SECRET is not set");
    return jwt.sign(payload, secret, {
      expiresIn: "7d",
    });
  }

  verifyRefreshToken(token: string) {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error("JWT_REFRESH_SECRET is not set");
    return jwt.verify(token, secret);
  }
}

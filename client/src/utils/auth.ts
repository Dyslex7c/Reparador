import jwt from "jsonwebtoken"

export function verifyToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    return decoded.id
  } catch (error) {
    return null
  }
}


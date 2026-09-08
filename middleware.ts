import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function unauthorized() {
  return new Response("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
  });
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const auth = req.headers.get("authorization");
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;

  if (!adminUser || !adminPass) {
    // If env not set, allow access (developer convenience), but log a warning server-side.
    // In production you should set ADMIN_USER and ADMIN_PASS.
    return NextResponse.next();
  }

  if (!auth || !auth.startsWith("Basic ")) return unauthorized();

  const b64 = auth.split(" ")[1];
  const decoded = Buffer.from(b64, "base64").toString("utf8");
  const [user, pass] = decoded.split(":");

  if (user === adminUser && pass === adminPass) return NextResponse.next();

  return unauthorized();
}

export const config = {
  matcher: ["/admin/:path*"],
};

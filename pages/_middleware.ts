import { getIronSession } from "iron-session/edge";
import type { NextRequest, NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.ua?.isBot) {
    return new Response("Plz don't be a Bot", { status: 403 });
  }
  //   if (!req.url.includes("/api")) {
  //     if (!req.url.includes("enter") && !req.cookies.carrotsession) {
  //       return NextResponse.redirect("/enter");
  //     }
  //   }
  // const res = NextResponse.next();
  // const session = await getIronSession(req, res, {
  //   cookieName: "carrotsession",
  //   password: process.env.COOKIE_PASSWORD!,
  //   cookieOptions: {
  //     secure: process.env.NODE_ENV! === "production", // if you are using https
  //   },
  // });

  // if (!req.url.includes("/api")) {
  //   if (!session.user && !req.url.includes("enter")) {
  //     // console.log(req.nextUrl);
  //     // req.nextUrl.searchParams.set("from", req.nextUrl.pathname);
  //     // req.nextUrl.pathname = "/enter";
  //     // console.log(req.nextUrl);
  //     return NextResponse.redirect("/enter");
  //   }
  // }
}

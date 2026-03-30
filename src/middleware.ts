import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware((auth, req) => {
  return;
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
import { JWT } from "next-auth/jwt";
declare module 'next-auth' {
  interface User {
    _id?: string;
    username?: string;
    name?: string;
    email?: string;
    isVerified?: boolean;
  }
  
  interface Session {
    user: {
      _id?: string;
      username?: string;
      name?: string;
      email?: string;
      isVerified?: boolean;
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id ?: string;
    username?: string;
    email?: string;
    isVerified?: boolean;
  }
}
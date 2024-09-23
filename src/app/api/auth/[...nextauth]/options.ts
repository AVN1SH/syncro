import { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";
import { JWT } from "next-auth/jwt";

export const authOptions : NextAuthOptions = {
  providers : [
    CredentialsProvider({
      name : "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials : any) : Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or : [
              { email : credentials.email }
            ]
          })

          if(!user) {throw new Error("No user found with this email.")}

          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

          if(!isPasswordCorrect) {throw new Error("Incorrect password.")}

          return user;

        } catch (err : any) {
          throw new Error(err);
        }
      }

    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
        }
      }
    })
  ],

  callbacks : {
    async jwt({ token, user } : { token : JWT, user : User }) {
      if(user) {
        token._id = user._id;
        token.username = user.username;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token } : { session : Session, token : JWT }) {
      session.user._id = token._id;
      session.user.username = token.username;
      session.user.isVerified = token.isVerified;
      return session;
    }
  },

  pages : {
    signIn : "/sign-in"
  },
  session : {
    strategy : "jwt"
  },
  secret : process.env.NEXTAUTH_SECRET
}
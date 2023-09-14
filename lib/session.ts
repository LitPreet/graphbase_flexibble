import { getServerSession } from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { SessionInterface, UserProfile } from "@/common.types";
import GoogleProvider from "next-auth/providers/google";
import jsonwebtoken from "jsonwebtoken";
import { JWT } from "next-auth/jwt";
import { getUser } from "./actions";
import { createUser } from "./actions";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    jwt: {
        encode: ({ secret, token }) => {
            const encodedToken = jsonwebtoken.sign(
                {
                    ...token,
                    iss: 'grafbase',
                    exp: Math.floor(Date.now() / 1000) + 60 * 60,
                },
                secret
            );
            console.log(encodedToken);
            return encodedToken
        },
        decode: async ({ secret, token }) => {
            const decodedToken = jsonwebtoken.verify(token!, secret);
            return decodedToken as JWT;
        },
    },
    theme: {
        colorScheme: "light",
        logo: "/logo.svg",
    },
    callbacks: {
        async session({ session }) {
            const email = session?.user?.email as string;

            try {
                const data = await getUser(email) as { user?: UserProfile };
                const newSession = {
                    ...session,
                    user: {
                        ...session.user,
                        ...data?.user,
                    },
                };
                return newSession;
            } catch (err: any) {
                console.log("error retrieving user data", err.message);
                return session;
            }
        },
        async signIn({ user }: { user: AdapterUser | User }) {
            try {
                //get user if exist
                const userExists = await getUser(user?.email as string) as {
                    user?: UserProfile
                };

                //if they don't exist , create them
                if (!userExists) {
                    await createUser(
                        user.name as string,
                        user.email as string,
                        user.image as string
                    );
                }
                return true;
            } catch (err: any) {
                console.log("Error checking if user exists: ", err.message);
                return false;
            }
        },
    },
};

export async function getCurrentUser() {
    const session = await getServerSession(authOptions) as SessionInterface;

    return session;
}

//return a google user
//name , email, avatarUrl
// projects , description, githubUrl

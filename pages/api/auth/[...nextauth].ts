import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_ID ?? "",
      clientSecret: process.env.TWITTER_SECRET ?? "",
      version: "2.0",
      authorization: {
        url: "https://twitter.com/i/oauth2/authorize",
        params: {
          scope: "users.read tweet.read offline.access bookmark.read",
        },
      },
    }),
    // ...add more providers here
  ],
  // pages: {
  //   signIn: "/",
  // },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (profile) {
        const data: any = profile.data;
        token["userProfile"] = {
          userID: data.id,
          userName: data.username,
        };
      }
      if (account) {
        token["credentials"] = {
          authToken: account.access_token,
          refreshToken: account.refresh_token,
        };
      }
      return token;
    },
  },
});

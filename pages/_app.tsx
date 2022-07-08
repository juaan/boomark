import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";
import Head from "next/head";
import { Tracking } from "nextwarm";

const breakpoints = createBreakpoints({
  sm: "320px",
  md: "768px",
  lg: "960px",
  xl: "1200px",
});

const extendedTheme = extendTheme({
  breakpoints,
  fonts: {
    body: "Noto Sans",
    heading: "Noto Sans",
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={extendedTheme}>
        <Head>
          <title>Boomark - manage your Twitter's bookmarks</title>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300&display=swap"
            rel="stylesheet"
          />
          <Tracking.GAScript trackingID={GA_TRACKING_ID ?? ""} />
        </Head>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;

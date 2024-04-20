"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider, useTheme } from "next-themes";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { GoogleOAuthProvider } from "@react-oauth/google";

const inter = Inter({ subsets: ["latin"] });

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_APP_API_BASE_URL}graphql`,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://${process.env.NEXT_PUBLIC_APP_BASE_URL}graphql`,
    // retryAttempts: 10,
  })
);

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  // const sub = useSubscription(
  //   gql`
  //     subscription {
  //       newNotification {
  //         post_id
  //         created_at
  //         notification_type
  //         sender_user {
  //           id
  //           username
  //           full_name
  //           profile_picture
  //         }
  //       }
  //     }
  //   `
  // );

  // console.log(sub);
  const CLIENT_ID: string = process.env.NEXT_PUBLIC_APP_GOOGLE_CLIENT_ID as string;
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloProvider client={client}>
          <NextUIProvider>
            <ThemeProvider attribute="class" defaultTheme="light">
              <GoogleOAuthProvider clientId={CLIENT_ID}>
                <div
                  className={`${theme} flex-col justify-center bg-white dark:bg-black`}
                >
                  {children}
                </div>
              </GoogleOAuthProvider>
            </ThemeProvider>
          </NextUIProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}

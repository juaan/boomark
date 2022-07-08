import type { NextPage } from "next";
import { useEffect, useState, useCallback, memo } from "react";
import LoginBtn from "@components/LoginBtn";
import { Container, Text } from "@chakra-ui/react";
import { BuiltInProviderType } from "next-auth/providers";
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from "next-auth/react";
import BookmarkItem from "@components/BookmarkItem";

type Props = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
};

type Bookmark = {
  id: string;
  text: string;
  author_name: string;
  author_image: string;
  author_username: string;
};

const Home: NextPage = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[] | null>(null);

  const getBookmark = useCallback(async () => {
    const response = await fetch("/api/twitter/bookmark");
    return response.json();
  }, [bookmarks]);

  useEffect(() => {
    if (!bookmarks) {
      const fetchBookmark = async () => {
        try {
          const bookmarksResponse = await getBookmark();
          console.log(bookmarksResponse);

          setBookmarks(bookmarksResponse.data.data);
        } catch (error) {
          console.log(error);
        }
      };

      fetchBookmark();
    }
  });

  return (
    <Container w={"100%"}>
      <Text fontSize="6xl">Boomark.</Text>
      <Text fontSize="2xl">
        Simple tools to search your twitter's bookmarks
      </Text>
      <Text fontSize="2xl">
        This app will only be able to read your bookmarks.
      </Text>
      <LoginBtn onClick={() => signIn("twitter")} />
      {(bookmarks ?? []).map((bookmark: Bookmark) => (
        // TODO: create function to merge includes, and media url
        <BookmarkItem key={bookmark.id} text={bookmark.text} />
      ))}
    </Container>
  );
};

export default memo(Home);

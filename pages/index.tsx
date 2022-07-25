import type { NextPage } from "next";
import { useEffect, useState, useCallback, memo, useRef } from "react";
import {
  CircularProgress,
  Container,
  Text,
  Box,
  Input,
} from "@chakra-ui/react";
import Fuse from "fuse.js";
import debounce from "lodash.debounce";
import { signIn } from "next-auth/react";

import LoginBtn from "@components/LoginBtn";
import Footer from "@components/Footer";
import BookmarkItem from "@components/BookmarkItem";

type Bookmark = {
  id: string;
  text: string;
  author_name: string;
  author_profile_image: string;
  author_username: string;
  entities: {
    urls: Record<string, any>[];
  };
};

const Home: NextPage = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[] | null>(null);
  const [bookmarksSearchResult, setBookmarksSearchResult] = useState<
    Bookmark[]
  >([]);
  const [loading, setLoading] = useState(false);

  const getBookmark = useCallback(async () => {
    const response = await fetch("/api/twitter/bookmark");
    return response.json();
  }, [bookmarks]);

  const fuseObject = useRef(
    new Fuse(bookmarks || [], {
      includeScore: true,
      keys: ["author_name", "text", "author_username"],
      threshold: 0.5,
      ignoreLocation: true,
    })
  );

  useEffect(() => {
    if (!bookmarks) {
      setLoading(true);
      const fetchBookmark = async () => {
        try {
          const bookmarksResponse = await getBookmark();
          setBookmarks(bookmarksResponse.data.data);
          fuseObject.current = new Fuse(bookmarksResponse.data.data, {
            includeScore: true,
            keys: ["author_name", "text", "author_username"],
            threshold: 0.5,
            ignoreLocation: true,
          });
        } catch (error) {
          console.log(error);
        }

        setLoading(false);
      };

      fetchBookmark();
    }
  }, [bookmarks]);

  const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    if (keyword) {
      const rawData = fuseObject.current.search(keyword);
      const bookmarkData = rawData.map((data) => data.item);
      setBookmarksSearchResult(bookmarkData);
    } else {
      setBookmarksSearchResult([]);
    }
  }, 300);

  const bookmarksData =
    bookmarksSearchResult.length > 0 ? bookmarksSearchResult : bookmarks;

  return (
    <>
      <Container w={"100%"}>
        <Text fontSize="6xl">Boomark.</Text>
        <Text fontSize="2xl">
          Simple tools to search your twitter's bookmarks
        </Text>
        <Text fontSize="2xl">
          This app will only be able to read your bookmarks.
        </Text>
        <LoginBtn onClick={() => signIn("twitter")} />
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress value={80} isIndeterminate />
          </Box>
        ) : (
          <Box marginTop={4}>
            {(bookmarksData || []).length > 0 && (
              <>
                <Input
                  placeholder="Search your bookmark"
                  onChange={handleSearch}
                />
                {(bookmarksData ?? []).map((bookmark: Bookmark) => (
                  <BookmarkItem key={bookmark.id} data={bookmark} />
                ))}
              </>
            )}
          </Box>
        )}
      </Container>
      <Container as="main" maxW="5xl" h="100%" pt={{ sm: "6rem", md: "8rem" }}>
        <Footer />
      </Container>
    </>
  );
};

export default memo(Home);

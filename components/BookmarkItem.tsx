import { Text, Box, Image, Link } from "@chakra-ui/react";

type Props = {
  data: Record<string, any>;
};

const BookmarkItem = ({ data }: Props) => {
  return (
    <Link
      href={
        data?.entities?.urls?.[0]?.url ||
        `https://twitter.com/${data.author_username}/status/${data.id}`
      }
      target={"_blank"}
    >
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        marginTop={4}
        display="flex"
      >
        <Image
          borderRadius="full"
          boxSize="50px"
          src={data.author_profile_image}
          fallbackSrc="https://via.placeholder.com/50"
          alt={`picture of ${data.author_name}`}
        />
        <Box marginLeft={2}>
          <Box display="flex">
            <Text fontWeight="bold" color="black">
              {data.author_name}
            </Text>
            <Text marginLeft={1} color="blackAlpha.600">
              @{data.author_username}
            </Text>
          </Box>

          <Text>{data.text}</Text>
        </Box>
      </Box>
    </Link>
  );
};

export default BookmarkItem;

import { Text, Box } from "@chakra-ui/react";

type Props = {
  text: string;
};

const BookmarkItem = ({ text }: Props) => {
  return (
    <Box>
      <Text>{text}</Text>
    </Box>
  );
};

export default BookmarkItem;

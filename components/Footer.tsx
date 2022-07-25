import { Box, Container, Text, useColorModeValue } from "@chakra-ui/react";

export default function SmallFooter() {
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
      style={{
        left: 0,
        bottom: 0,
        position: "fixed",
        width: "100%",
        paddingBottom: 8,
      }}
    >
      <Container maxW={"6xl"} py={4}>
        <Text align={"center"}>
          © made with 🚬 by <a href="https://github.com/juaan">Juan</a>
        </Text>
      </Container>
    </Box>
  );
}

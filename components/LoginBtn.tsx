import { Button, Text, Box } from "@chakra-ui/react";
import { useSession, signOut } from "next-auth/react";
import React from "react";

type Props = {
  onClick: Function;
};

const LoginBtn = (props: Props) => {
  const { data, status } = useSession();

  if (status == "loading") {
    return <></>;
  }

  if (data) {
    return (
      <Box
        marginTop={4}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        Signed in as {data?.user?.name}
        <Button
          onClick={() => signOut()}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign out
        </Button>
      </Box>
    );
  }
  return (
    <Button colorScheme="twitter" onClick={() => props.onClick()} marginTop={8}>
      <Text color={"white"}>Get Started</Text>
    </Button>
  );
};

export default LoginBtn;

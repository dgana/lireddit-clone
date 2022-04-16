import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { MeQuery, useLogoutMutation, useMeQuery } from '../generated/graphql'
import { isServer } from '../utils/isServer'
import { Link as ChakraLink } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export const NavBar: React.FC = () => {
  return (
    <Box
      position="sticky"
      top={0}
      color="white"
      bg="steelblue"
      padding={4}
      ml="auto"
      zIndex={100}
    >
      <NavBarContent />
    </Box>
  )
}

const NavBarContent: React.FC = () => {
  const [{ data, fetching }] = useMeQuery({
    pause: isServer()
  })

  if (fetching) {
    return <Text color="white">Loading...</Text>
  }

  return (
    <Flex maxW={800} m="auto" justify="space-between">
      <Text fontWeight={600} mr={2}>
        <Link href="/">
          <Heading>LiReddit</Heading>
        </Link>
      </Text>
      <RightBar data={data} />
    </Flex>
  )
}

interface RightBar {
  data: MeQuery
}

const RightBar: React.FC<RightBar> = ({ data }) => {
  const router = useRouter()
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation()

  if (data?.me?.username) {
    return (
      <Flex align="center">
        <ChakraLink as={Link} href="/create-post">
          Create Post
        </ChakraLink>
        <Text mx={4} fontWeight={600} color="white">
          {data.me.username}
        </Text>
        <Button
          onClick={async () => {
            await logout()
            router.reload()
          }}
          color="white"
          isLoading={logoutFetching}
          variant="link"
        >
          Logout
        </Button>
      </Flex>
    )
  }

  return (
    <Flex align="center">
      <Text ml="auto" fontWeight={600} mr={2}>
        <Link href="login">Login</Link>
      </Text>
      <Text fontWeight={600} mr={2}>
        <Link href="register">Register</Link>
      </Text>
    </Flex>
  )
}

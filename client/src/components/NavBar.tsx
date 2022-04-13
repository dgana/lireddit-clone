import { Box, Button, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'

export const NavBar: React.FC = () => {
  return (
    <Box bg="steelblue" padding={4} ml="auto">
      <NavBarContent />
    </Box>
  )
}

const NavBarContent: React.FC = () => {
  const [{ data, fetching }] = useMeQuery()
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation()

  if (fetching) {
    return <Text color="white">Loading...</Text>
  }

  if (data.me?.username) {
    return (
      <Flex>
        <Text fontWeight={600} color="white" mr={2}>
          {data.me.username}
        </Text>
        <Button
          onClick={() => logout()}
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
    <Flex ml="auto" color="white">
      <Text fontWeight={600} mr={2}>
        <Link href="login">Login</Link>
      </Text>
      <Text fontWeight={600} mr={2}>
        <Link href="register">Register</Link>
      </Text>
    </Flex>
  )
}

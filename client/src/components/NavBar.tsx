import { Box, Button, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { MeQuery, useLogoutMutation, useMeQuery } from '../generated/graphql'
import { isServer } from '../utils/isServer'

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
    <Flex justify="space-between">
      <Text fontWeight={600} mr={2}>
        <Link href="/">Home</Link>
      </Text>
      <RightBar data={data} />
    </Flex>
  )
}

interface RightBar {
  data: MeQuery
}

const RightBar: React.FC<RightBar> = ({ data }) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation()

  if (data?.me?.username) {
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
    <>
      <Text ml="auto" fontWeight={600} mr={2}>
        <Link href="login">Login</Link>
      </Text>
      <Text fontWeight={600} mr={2}>
        <Link href="register">Register</Link>
      </Text>
    </>
  )
}

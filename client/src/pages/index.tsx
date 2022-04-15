import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { usePostsQuery } from '../generated/graphql'
import { Layout } from '../components/Layout'
import Link from 'next/link'
import {
  Box,
  Heading,
  Link as ChakraLink,
  VStack,
  Text,
  Flex,
  Button
} from '@chakra-ui/react'
import { useState } from 'react'

const Index = () => {
  const [variables, setVariables] = useState({ limit: 10, cursor: null })
  const [{ data, fetching }] = usePostsQuery({
    variables
  })

  if (!fetching && !data) {
    return <Box>you got query failed for some reason</Box>
  }

  return (
    <Layout>
      <Flex justify="space-between" align="center" mb={5}>
        <Heading>LiReddit</Heading>
        <ChakraLink as={Link} href="/create-post">
          Create Post
        </ChakraLink>
      </Flex>
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <VStack spacing={4}>
          {data.posts.posts.map((p) => (
            <Box key={p.id} w="100%" p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{p.title}</Heading>
              <Text mt={4}>{p.textSnippet}</Text>
            </Box>
          ))}
        </VStack>
      )}
      {data && data.posts.hasMore ? (
        <Flex my={6} justify="center">
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
              })
            }}
            w="100%"
            colorScheme="gray"
          >
            Load More
          </Button>
        </Flex>
      ) : null}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)

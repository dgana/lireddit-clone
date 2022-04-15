import {
  Box,
  Button,
  Flex,
  Heading,
  Link as ChakraLink,
  Text,
  VStack
} from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import Link from 'next/link'
import { useState } from 'react'
import { Layout } from '../components/Layout'
import { UpdootSection } from '../components/UpdootSection'
import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

const Index = () => {
  const [variables, setVariables] = useState({ limit: 15, cursor: null })
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
            <Flex key={p.id} w="100%" p={5} shadow="md" borderWidth="1px">
              <UpdootSection post={p} />
              <Box>
                <Heading fontSize="xl">{p.title}</Heading>
                <Text mt={4}>posted by {p.creator.username}</Text>
                <Text mt={4}>{p.textSnippet}</Text>
              </Box>
            </Flex>
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

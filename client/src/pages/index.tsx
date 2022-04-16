import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link as ChakraLink,
  Text,
  VStack
} from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import Link from 'next/link'
import { useState } from 'react'
import { Layout } from '../components/Layout'
import { UpdootSection } from '../components/UpdootSection'
import { useDeletePostMutation, usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { DeleteIcon } from '@chakra-ui/icons'

const Index = () => {
  const [variables, setVariables] = useState({ limit: 15, cursor: null })
  const [{ data, fetching }] = usePostsQuery({
    variables
  })
  const [, deletePost] = useDeletePostMutation()

  if (!fetching && !data) {
    return <Box>you got query failed for some reason</Box>
  }

  return (
    <Layout>
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <VStack spacing={4}>
          {data.posts.posts.map((p) =>
            !p ? null : (
              <Flex key={p.id} w="100%" p={5} shadow="md" borderWidth="1px">
                <UpdootSection post={p} />
                <Box flex={1}>
                  <ChakraLink href={`/post/${p.id}`} as={Link}>
                    <Heading fontSize="xl">{p.title}</Heading>
                  </ChakraLink>
                  <Text mt={4}>posted by {p.creator.username}</Text>
                  <Text mt={4}>{p.textSnippet}</Text>
                  <Flex>
                    <IconButton
                      ml="auto"
                      icon={<DeleteIcon />}
                      aria-label={'Delete Post'}
                      colorScheme="red"
                      onClick={() => deletePost({ id: p.id })}
                    ></IconButton>
                  </Flex>
                </Box>
              </Flex>
            )
          )}
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

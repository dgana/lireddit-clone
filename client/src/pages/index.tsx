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
import Link from 'next/link'
import { Layout } from '../components/Layout'
import { UpdootSection } from '../components/UpdootSection'
import {
  useDeletePostMutation,
  useMeQuery,
  usePostsQuery
} from '../generated/graphql'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import withApollo from '../utils/withApollo'

const Index = () => {
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null
    },
    notifyOnNetworkStatusChange: true
  })
  const [deletePost] = useDeletePostMutation()
  const { data: meData } = useMeQuery()

  if (!loading && !data) {
    return (
      <Box>
        <div>you got query failed for some reason</div>
        <div>{error.message}</div>
      </Box>
    )
  }

  return (
    <Layout>
      {!data && loading ? (
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
                </Box>
                {meData?.me?.id === p.creator.id && (
                  <Flex justify="flex-end" align="flex-end">
                    <Box>
                      <IconButton
                        mr={2}
                        icon={<DeleteIcon />}
                        aria-label={'Delete Post'}
                        onClick={() => deletePost({ variables: { id: p.id } })}
                      ></IconButton>
                      <ChakraLink as={Link} href={`/post/edit/${p.id}`}>
                        <IconButton
                          icon={<EditIcon />}
                          aria-label={'Edit Post'}
                        ></IconButton>
                      </ChakraLink>
                    </Box>
                  </Flex>
                )}
              </Flex>
            )
          )}
        </VStack>
      )}
      {data && data.posts.hasMore ? (
        <Flex my={6} justify="center">
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt
                }
              })
            }}
            isLoading={loading}
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

export default withApollo({ ssr: true })(Index)

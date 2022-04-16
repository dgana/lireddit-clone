import { withUrqlClient } from 'next-urql'
import { Layout } from '../../components/Layout'
import { createUrqlClient } from '../../utils/createUrqlClient'
import { Box, Flex, Heading, IconButton, Link, Text } from '@chakra-ui/react'
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { useDeletePostMutation, useMeQuery } from '../../generated/graphql'
import { Link as ChakraLink } from '@chakra-ui/react'
import Router from 'next/router'

export const Post = () => {
  const [{ data, fetching }] = useGetPostFromUrl()
  const [, deletePost] = useDeletePostMutation()
  const [{ data: meData }] = useMeQuery()

  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    )
  }

  if (!data?.post) {
    return (
      <Layout>
        <Text>Could not find post</Text>
      </Layout>
    )
  }

  return (
    <Layout>
      <Flex justify="space-between" align="center">
        <Heading mb={4}>{data?.post?.title}</Heading>
        {meData?.me.id === data?.post?.creator.id && (
          <Flex justify="flex-end" align="flex-end">
            <Box>
              <IconButton
                mr={2}
                icon={<DeleteIcon />}
                aria-label={'Delete Post'}
                onClick={() => {
                  Router.back()
                  deletePost({ id: data?.post?.id })
                }}
              ></IconButton>
              <ChakraLink as={Link} href={`/post/edit/${data?.post?.id}`}>
                <IconButton
                  icon={<EditIcon />}
                  aria-label={'Edit Post'}
                ></IconButton>
              </ChakraLink>
            </Box>
          </Flex>
        )}
      </Flex>
      <Text>{data?.post?.text}</Text>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Post)

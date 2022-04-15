import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { usePostsQuery } from '../generated/graphql'
import { Layout } from '../components/Layout'
import Link from 'next/link'
import { Box, Link as ChakraLink } from '@chakra-ui/react'

const Index = () => {
  const [{ data }] = usePostsQuery()
  return (
    <Layout>
      <Box mb={5}>
        <ChakraLink as={Link} href="/create-post">
          Create Post
        </ChakraLink>
      </Box>
      {!data ? (
        <div>loading...</div>
      ) : (
        data.posts.map((p) => <div key={p.id}>{p.title}</div>)
      )}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)

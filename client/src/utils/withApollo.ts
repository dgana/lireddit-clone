import { withApollo } from 'next-apollo'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { PaginatedPosts } from '../generated/graphql'

const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: [],
            merge(
              existing: PaginatedPosts | undefined,
              incoming: PaginatedPosts
            ): PaginatedPosts {
              return {
                ...incoming,
                posts: [...(existing?.posts || []), ...incoming?.posts]
              }
            }
          }
        }
      }
    }
  })
})

export default withApollo(apolloClient)

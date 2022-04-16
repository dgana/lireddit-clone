import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import theme from '../theme'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { PaginatedPosts } from '../generated/graphql'

const client = new ApolloClient({
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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  )
}

export default MyApp

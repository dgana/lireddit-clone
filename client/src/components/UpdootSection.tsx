import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, IconButton } from '@chakra-ui/react'
import React, { useState } from 'react'
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql'

interface UpdootSectionProps {
  post: PostSnippetFragment
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setUpdootLoading] = useState<
    'updoot-loading' | 'downdoot-loading' | 'not-loading'
  >('not-loading')
  const [vote] = useVoteMutation()
  return (
    <Flex mr={3} direction="column" align="center" justify="center">
      <IconButton
        onClick={() => {
          if (post.voteStatus === 1) {
            return
          }
          setUpdootLoading('updoot-loading')
          vote({
            variables: {
              postId: post.id,
              value: 1
            }
          })
          setUpdootLoading('not-loading')
        }}
        as={ChevronUpIcon}
        isLoading={loadingState === 'updoot-loading'}
        w={8}
        h={8}
        colorScheme={post.voteStatus === 1 ? 'green' : undefined}
        aria-label={'updoot-post'}
      />
      {post.points}
      <IconButton
        onClick={() => {
          if (post.voteStatus === -1) {
            return
          }
          setUpdootLoading('downdoot-loading')
          vote({
            variables: {
              postId: post.id,
              value: -1
            }
          })
          setUpdootLoading('not-loading')
        }}
        isLoading={loadingState === 'downdoot-loading'}
        as={ChevronDownIcon}
        w={8}
        h={8}
        colorScheme={post.voteStatus === -1 ? 'red' : undefined}
        aria-label={'downdoot-post'}
      />
    </Flex>
  )
}

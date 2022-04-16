import { Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React from 'react'
import { InputField } from '../../../components/InputField'
import { Layout } from '../../../components/Layout'
import { useUpdatePostMutation } from '../../../generated/graphql'
import { createUrqlClient } from '../../../utils/createUrqlClient'
import { useGetPostFromUrl } from '../../../utils/useGetPostFromUrl'
import { useIsAuth } from '../../../utils/useIsAuth'

const EditPost: React.FC = () => {
  const router = useRouter()
  const [, editPost] = useUpdatePostMutation()
  const [{ data, fetching }] = useGetPostFromUrl()
  useIsAuth()

  if (fetching) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    )
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: data?.post?.title, text: data?.post?.text }}
        onSubmit={async (values) => {
          const { error } = await editPost({
            ...values,
            updatePostId: parseInt(router.query.id as string)
          })
          if (!error) {
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <InputField
              textarea
              name="text"
              placeholder="text..."
              label="Body"
            />
            <Button
              mt={4}
              type="submit"
              variant="solid"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Edit Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(EditPost)

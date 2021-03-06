import { Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import React from 'react'
import { InputField } from '../../../components/InputField'
import { Layout } from '../../../components/Layout'
import { useUpdatePostMutation } from '../../../generated/graphql'
import { useGetPostFromUrl } from '../../../utils/useGetPostFromUrl'
import { useIsAuth } from '../../../utils/useIsAuth'

const EditPost: React.FC = () => {
  const router = useRouter()
  const [editPost] = useUpdatePostMutation()
  const { data, loading } = useGetPostFromUrl()
  useIsAuth()

  if (loading) {
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
          const { errors } = await editPost({
            variables: {
              ...values,
              updatePostId: parseInt(router.query.id as string)
            }
          })
          if (!errors) {
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

export default EditPost

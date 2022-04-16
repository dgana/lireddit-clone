import { Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import React from 'react'
import { InputField } from '../components/InputField'
import { Layout } from '../components/Layout'
import { useCreatePostMutation } from '../generated/graphql'
import { useIsAuth } from '../utils/useIsAuth'
import withApollo from '../utils/withApollo'

const CreatePost: React.FC = () => {
  const router = useRouter()
  const [createPost] = useCreatePostMutation()
  useIsAuth()

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values) => {
          const { errors } = await createPost({ variables: { input: values } })
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
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withApollo({ ssr: false })(CreatePost)

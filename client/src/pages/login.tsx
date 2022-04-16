import React from 'react'
import { Formik, Form } from 'formik'
import { Wrapper } from '../components/Wrapper'
import { InputField } from '../components/InputField'
import { Button, Flex, Link } from '@chakra-ui/react'
import { useLoginMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from 'next/router'

const Login: React.FC = () => {
  const router = useRouter()
  const [login] = useLoginMutation()
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ variables: values })
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors))
          } else if (response.data?.login.user) {
            if (typeof router.query.next === 'string') {
              router.push(router.query.next)
            } else {
              router.push('/')
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="usernameOrEmail"
              label="Username or Email"
            />
            <InputField
              name="password"
              placeholder="password"
              label="Password"
              type="password"
            />
            <Flex mt={1}>
              <Link ml="auto" href="/forgot-password">
                Forgot Password?
              </Link>
            </Flex>
            <Button
              mt={4}
              type="submit"
              variant="solid"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default Login

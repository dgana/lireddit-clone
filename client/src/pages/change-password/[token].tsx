import { Box, Button, Flex } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { InputField } from '../../components/InputField'
import { Wrapper } from '../../components/Wrapper'
import {
  MeDocument,
  MeQuery,
  useChangePasswordMutation
} from '../../generated/graphql'
import { toErrorMap } from '../../utils/toErrorMap'
import { useState } from 'react'
import Link from 'next/link'

export const ChangePassword: NextPage = () => {
  const router = useRouter()
  const [changePassword] = useChangePasswordMutation()
  const [tokenError, setTokenError] = useState('')
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            variables: {
              newPassword: values.newPassword,
              token:
                typeof router.query.token === 'string' ? router.query.token : ''
            },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.changePassword.user
                }
              })
              cache.evict({ fieldName: 'posts' })
            }
          })
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors)
            if ('token' in errorMap) {
              setTokenError(errorMap.token)
            }
            setErrors(errorMap)
          } else if (response.data?.changePassword.user) {
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="New Password"
              label="New Password"
              type="password"
            />
            {tokenError ? (
              <Flex>
                <Box mr={2} color="red">
                  {tokenError}
                </Box>
                <Link href="/forgot-password">click here to get a new one</Link>
              </Flex>
            ) : null}
            <Button
              mt={4}
              type="submit"
              variant="solid"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default ChangePassword

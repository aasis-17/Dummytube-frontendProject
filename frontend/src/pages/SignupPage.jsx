import React from 'react'
import { PageProtector, SignUp } from '../components'

function SignupPage() {
  return (
    <PageProtector authentication = {false}>
      <SignUp />
    </PageProtector>
  )
}

export default SignupPage
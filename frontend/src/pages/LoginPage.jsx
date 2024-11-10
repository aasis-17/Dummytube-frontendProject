import React from 'react'
import { Login, PageProtector } from '../components'

function LoginPage() {
  return (
    <PageProtector authentication = {false}>
        <Login />
    </PageProtector>
  )
}

export default LoginPage
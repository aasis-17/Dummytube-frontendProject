import React from 'react'
import { Home, PageProtector } from '../components'

function HomePage() {
  return (
    <PageProtector authentication = {false}>
        <Home />
    </PageProtector>
  )
}

export default HomePage
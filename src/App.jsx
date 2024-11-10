import { useEffect, useState } from 'react'
import { Container, Footer, Header } from './components/index.js'
import {Outlet} from "react-router-dom"
import { useDispatch } from 'react-redux'
import authService from './services/authServices.js'
import { login, logout } from './store/authSlice.js'
import {QueryClient, QueryClientProvider} from "react-query"
import useDataFetch from './utils/useDataFetch.js'

function App() {
 
  const dispatch = useDispatch()

  const queryClient = new QueryClient()

  const fetcher = () => {
    return authService.getCurrentUser()
  }
  const {isLoading, error, data} = useDataFetch(fetcher)

  if (isLoading){
    return <p>loading app...</p>
  }
  if(data) dispatch(login(data.data))
    else  dispatch(logout())


    return (
    // <Container className="relative  overflow-x-hidden ">
      <QueryClientProvider client={queryClient}>
      <div className=' max-w-6xl mx-auto h-screen overflow-x-hidden'>
        <Header />
          <main className='mt-14 h-screen '>
          <Outlet /> 
          </main>
      </div>    
      </QueryClientProvider>
    // </Container>
    
    )
    
}

export default App

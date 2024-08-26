
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import store from './store/store.js'
import { Provider } from "react-redux"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SignUp, PageProtector, Logo, Login, Home, VideoDetail} from "./components/index.js"


const router  = createBrowserRouter([
  {
    path : "/",
    element : <App />,
    children : [
      {
        path : "/",
        element : <Home />
      },
      {
        path : "/video-detail/:videoId",
        element : <VideoDetail />
      }
    ]
  },
  {
    
      path : "/create-account",
      element : 
         <PageProtector authentication = {false}>
          <SignUp />
         </PageProtector>
  },
  {
    path : "/login",
    element : (
      <PageProtector authentication = {false}>
        <Login />
      </PageProtector>
    )
  }
])

createRoot(document.getElementById('root')).render(

    <Provider store = {store}>
      <RouterProvider router={router}/>
    </Provider>
  
)

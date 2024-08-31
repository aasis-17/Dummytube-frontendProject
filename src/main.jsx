
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import store from './store/store.js'
import { Provider } from "react-redux"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SignUp, PageProtector, Logo, Login, Home, VideoDetail, ChannelProfile} from "./components/index.js"
import CommentSection from './components/videoDetail/CommentSection.jsx'
import DescriptionSection from './components/videoDetail/DescriptionSection.jsx'
import LeftSection from './components/videoDetail/LeftSection.jsx'


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
        path : "/channel-profile",
        element : (<PageProtector>
                    <ChannelProfile />
        </PageProtector>)
      },
      {
        path : "video-detail/:videoId",
        element : <VideoDetail />,
        children :[
          {
            path:"comment",
            element : (<PageProtector>
                <CommentSection />
                     </PageProtector>),
            
          },
          {
            path : "description",
            element : <DescriptionSection />
          }
          
        ]
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

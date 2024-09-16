
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
import PlaylistContainer from './components/container/PlaylistContainer.jsx'
import PlaylistSection from './components/videoDetail/PlaylistSection.jsx'
import Playlist from './components/Playlist.jsx'
import ProfileVideos from './components/ProfileVideos.jsx'
import ProfileLikedVideos from './components/ProfileLikedVideos.jsx'
import YourVideos from './components/YourVideos.jsx'
import UploadVideo from './components/UploadVideo.jsx'



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
        path : "/playlist/:channelId",
        element : (<PlaylistContainer>
                      <Playlist />
                  </PlaylistContainer>)
      },
      {
        path : "/channel-profile/:channelId",
        element : (<PageProtector>
                    <ChannelProfile />
                  </PageProtector>),
        children : [
          {
            path : "playlist",
            element : (<PlaylistContainer>
                          <Playlist />
                      </PlaylistContainer>)
          },
          {
            path : "videos",
            element : <ProfileVideos />

          },
          {
            path : "likedVideos",
            element : <ProfileLikedVideos />
          }
        ]
       
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

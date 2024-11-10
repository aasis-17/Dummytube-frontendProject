
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import store from './store/store.js'
import { Provider } from "react-redux"
import DeactivateAccount from './components/DeactivateAccount.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ChannellikedvideosPage, ChannelplaylistPage, ChannelprofilePage, ChannelvideoPage, HomePage, LoginPage, SettingPage, SignupPage, VideodetailPage,  } from "./pages/index.js"
import { PageProtector, AccountInfo, ChangePassword, CommentSection, Dashboard, DescriptionSection, Playlist, ProfileLikedVideos, ProfileVideos } from './components/index.js'

const router  = createBrowserRouter([
  {
    path : "/",
    element : <App />,
    children : [
      {
        path : "/",
        element : <HomePage />
      },
      {
        path : "/setting",
        element : <SettingPage />,
        children : [
          {
            path : "accountSetting",
            element : <AccountInfo />
          },
          {
            path : "changePassword",
            element : <ChangePassword />
          },
          {
            path : "dashboard",
            element : <Dashboard />
          },
          {
            path : "deactivate",
            element : <DeactivateAccount />
          }
        ]
      },
      {
        path : "/yourVideos",
        element : <ChannelvideoPage />
      },
      {
        path : "/likedVideos",
        element : <ChannellikedvideosPage />
      },
      {
        path : "/playlist/:channelId",
        element : <ChannelplaylistPage />
      },
      {
        path : "/channel-profile/:channelId",
        element : <ChannelprofilePage />,
        children : [
          {
            path : "playlist",
            element : ( <Playlist /> )
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
        element : <VideodetailPage />,
        children :[
          {
            path:"comment",
            element : (<PageProtector>
                          <CommentSection />
                       </PageProtector>
                      ),  
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
      element : <SignupPage />
  },
  {
    path : "/login",
    element : <LoginPage />
  }
])

createRoot(document.getElementById('root')).render(

    <Provider store = {store}>
      <RouterProvider router={router}/>
    </Provider>
  
)

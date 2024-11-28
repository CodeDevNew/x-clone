import React, { useEffect, useState } from 'react'
import {Navigate,Routes,Route} from "react-router-dom";
import ProfilePage from './pages/profile/ProfilePage'
import LoginPage from './pages/auth/login/LoginPage';
import SignUpPage from './pages/auth/signup/SignUpPage';
import HomePage from './pages/home/HomePage';
import Sidebar from './components/common/Sidebar';
import RightPanel from './components/common/RightPanel';
import NotificationPage from './pages/notification/NotificationPage';
import {Toaster} from "react-hot-toast";
import { useQuery } from '@tanstack/react-query';
import { baseUrl } from './constant/url';
import LoadingSpinner from './components/common/LoadingSpinner';

const App = () => {
    const [loggedOut, setLoggedOut] = useState(true);
  const {data :authUser,isLoading}=useQuery({
    queryKey :["authUser"],//by using this key queryfunction can be called for anywhere or to  get data protect route
    queryFn : async ()=>{
      try {
        const res = await fetch(`${baseUrl}/api/auth/me`,{
          method :"GET",
          credentials :"include",
          headers : {
            "Content-Type" :"application/json"
          }
        })
        const data = await res.json();
        if(!res.ok){
        // setLoggedOut(prev=>!prev);
          throw new Error(data.error || "Something went Wrong");
        }
        console.log("Auth User : ",data)
        return data;
      } catch (error) {
        throw error;
      }
    },
    retry : false//prevents multiple times api fetch request
  });

  if(isLoading){
    return(
      <div className='flex justify-center items-center h-screen'>
        <LoadingSpinner size='lg'/>

      </div>
    )
  }
    if (!loggedOut) {
      return <LoginPage /> 
    }
  return (
    <div className="flex max-w-6xl mx-auto">
      {/*common */}
      {authUser && <Sidebar setLoggedOut={setLoggedOut} />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App

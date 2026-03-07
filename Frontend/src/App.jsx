import React from "react"
import { BrowserRouter, Routes , Route } from "react-router-dom"
import Home from "./pages/home/Home"
import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute"
import SocketManager from "./socket/Socket.jsx"
import EditProfile  from "./pages/editProfile/EditProfile.jsx"

function App() {

  return (
   <>
      <SocketManager/>
      <BrowserRouter>
         <Routes>
             <Route path='/' element={
              <ProtectedRoute>
                 <Home/>
             </ProtectedRoute>}/>
             <Route path="/edit-profile" element={<EditProfile />} />
             <Route path='/login' element={<Login/>}/>
             <Route path='/register' element={<Register/>}/>
         </Routes>
      </BrowserRouter>
   </>
  )
}

export default App

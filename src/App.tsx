import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import Header from "./components/Header"
import Cards from "./pages/Cards/Cards"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import { AuthProvider } from "./context/AuthContext"
import Profile from "./pages/Profile/Profile"
import Collection from "./pages/Collection/Collection"
import ProtectedRoute from "./components/ProtectedRoute"
import Favorites from "./pages/Favorites/Favorites"
import Binders from "./pages/Binders/Binders"
import BinderDetails from "./pages/BinderDetails/BinderDetails"
import { useEffect } from "react"
import { limparCacheExpirado } from "./utils/storage"

const App = () => {

useEffect(() => {
    limparCacheExpirado();
}, []);

  return (
    <>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/collection" element={<ProtectedRoute><Collection /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/binders" element={<ProtectedRoute><Binders /></ProtectedRoute>} />
          <Route path="/binders/:id" element={<ProtectedRoute><BinderDetails /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App

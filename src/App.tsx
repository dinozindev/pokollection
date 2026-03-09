import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import Header from "./components/Header"
import Cards from "./pages/Cards/Cards"
import Footer from "./components/Footer"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App

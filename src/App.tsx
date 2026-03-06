import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import Header from "./components/Header"
import Cards from "./pages/Cards/Cards"

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cards" element={<Cards />} />
      </Routes>
    </>
  )
}

export default App

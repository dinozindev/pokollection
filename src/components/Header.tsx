import { useState } from "react"
import { Link } from "react-router-dom";

const Header = () => {

    const [menu, setMenu] = useState<boolean>(false);

    const toggleMenu = () => {
        setMenu(!menu);
    }

    return (
        <header className="px-8 py-6 flex items-center justify-between bg-white shadow-xl">
            <h1 className="text-amber-800 text-3xl font-medium">Pokollection</h1>
            <div className="md:hidden">
                <i
                    className={`fa-solid text-amber-800 ${menu ? "fa-xmark" : "fa-bars"} text-4xl cursor-pointer`}
                    onClick={toggleMenu}
                />
            </div>
            <div
                className={`fixed top-20 right-0 h-full w-3/5 bg-miniwidget flex flex-col items-end pr-8 gap-6 py-8
  transform transition-transform duration-300 ease-in-out md:hidden bg-white text-amber-800
  ${menu ? "translate-x-0" : "translate-x-full"}`}
            >
                <Link to="/cards">Cards</Link>
                <Link to="/perfil">Perfil</Link>
                <Link to="/colecao">Coleção</Link>
                <Link to="/login" target="_blank">
                    <div className="border-solid rounded-md border px-5 py-3 text-amber-800 hover:text-white transition-all">
                        Login
                    </div>
                </Link>
            </div>
        </header>
    )
}

export default Header
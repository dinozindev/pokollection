import { useContext, useState } from "react"
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import * as firebase from "firebase/auth";
import { auth } from "../firebase/firebase";

const Header = () => {

    const { user } = useContext(AuthContext);

    const [menu, setMenu] = useState<boolean>(false);

    const toggleMenu = () => {
        setMenu(!menu);
    }

    const doSignOut = () => {
        firebase.signOut(auth);
        window.location.reload()
    }

    return (
        <header className="px-8 py-6 flex items-center justify-between bg-white shadow-xl fixed w-screen z-50">
            <h1 className="text-amber-800 text-3xl font-medium">Pokollection</h1>
            <div className="lg:hidden">
                <i
                    className={`fa-solid text-amber-800 ${menu ? "fa-xmark" : "fa-bars"} text-4xl cursor-pointer`}
                    onClick={toggleMenu}
                />
            </div>
            <div className="hidden lg:flex gap-4 items-center">
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="/cards">Cards</Link>
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="/profile">Perfil</Link>
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="/collection">Coleção</Link>
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="/favorites">Favoritos</Link>
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="/binders">Binders</Link>
                {user ? <div className="border-solid rounded-md border px-3 py-2 text-amber-800 hover:text-black cursor-pointer transition-all" onClick={() => doSignOut()}>
                    Logout
                </div>
                    : <Link to="/login">
                        <div className="border-solid rounded-md border px-3 py-2 text-amber-800 hover:text-black cursor-pointer transition-all">
                            Login
                        </div></Link>}
            </div>
            <div
                className={`fixed top-20 right-0 h-full w-6/12 bg-miniwidget flex flex-col items-end pr-8 gap-6 py-8
  transform transition-transform duration-300 ease-in-out lg:hidden bg-white text-amber-800
  ${menu ? "translate-x-0" : "translate-x-full"} md:w-4/12`}
            >
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="/cards">Cards</Link>
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="/profile">Perfil</Link>
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="/collection">Coleção</Link>
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="/favorites">Favoritos</Link>
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="/binders">Binders</Link>
                {user ? <div className="border-solid rounded-md border px-5 py-3 text-amber-800 hover:text-black cursor-pointer transition-all" onClick={() => doSignOut()}>
                    Logout
                </div>
                    : <Link to="/login">
                        <div className="border-solid rounded-md border px-5 py-3 text-amber-800 hover:text-black cursor-pointer transition-all">
                            Login
                        </div></Link>}
            </div>
        </header>
    )
}

export default Header
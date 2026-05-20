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
        <header className="px-6 lg:px-12 py-6 flex items-center justify-between bg-white shadow-xl fixed w-screen z-50">
            <Link to="/">
                <h1 className="text-amber-800 text-3xl font-medium">Pokollection</h1>
            </Link>
            <div className="lg:hidden">
                <button
                    aria-pressed={menu}
                    onClick={toggleMenu}
                    className="group inline-flex w-12 h-12 shadow-md shadow-black/10 text-amber-800 bg-white items-center justify-center rounded transition cursor-pointer"
                >
                    <span className="sr-only">Menu</span>

                    <svg
                        className="w-6 h-6 fill-current pointer-events-none"
                        viewBox="0 0 16 16"
                    >
                        <rect
                            className="origin-center -translate-y-1.25 translate-x-1.75 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-pressed:translate-x-0 group-aria-pressed:translate-y-0 group-aria-pressed:rotate-315"
                            y="7"
                            width="9"
                            height="2"
                            rx="1"
                        />
                        <rect
                            className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-pressed:rotate-45"
                            y="7"
                            width="16"
                            height="2"
                            rx="1"
                        />
                        <rect
                            className="origin-center translate-y-1.25 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-pressed:translate-y-0 group-aria-pressed:-rotate-225"
                            y="7"
                            width="9"
                            height="2"
                            rx="1"
                        />
                    </svg>
                </button>
            </div>
            <div className="hidden lg:flex gap-8 items-center">
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="/cards">Cards</Link>
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="/profile">Perfil</Link>
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="/collection">Coleção</Link>
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="wishlist">Wishlist</Link>
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="/favorites">Favoritos</Link>
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="/binders">Binders</Link>
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="/social">Social</Link>
                {user ? <div className="border-solid rounded-md border px-3 py-2 text-amber-800 hover:text-black cursor-pointer transition-all" onClick={() => doSignOut()}>
                    Logout
                </div>
                    :
                    <Link to="/login" className="w-1/2">
                        <div className="border-solid rounded-md border px-6 py-2 text-amber-800 hover:text-black cursor-pointer transition-all text-center">
                            Login
                        </div></Link>
                }
            </div>
            <div
                className={`fixed top-20 right-0 h-full w-6/12 bg-miniwidget flex flex-col items-end pr-8 gap-6 py-8
  transform transition-transform duration-300 ease-in-out lg:hidden bg-white text-amber-800
  ${menu ? "translate-x-0" : "translate-x-full"} md:w-4/12`}
            >
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="/cards">Cards</Link>
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="/profile">Perfil</Link>
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="/collection">Coleção</Link>
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="wishlist">Wishlist</Link>
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="/favorites">Favoritos</Link>
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="/binders">Binders</Link>
                <Link className="cursor-pointer hover:text-amber-800 transition-all" to="/social">Social</Link>
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
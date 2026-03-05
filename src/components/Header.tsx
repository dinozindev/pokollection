import { useState } from "react"

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
        {menu && (
                <div className="absolute top-20 right-0 bg-white w-2/3 bg-miniwidget flex flex-col items-center gap-6 py-8 md:hidden">
                    <a className="transition-all" href="#details">Cards</a>
                    <a className="transition-all" href="#skills">Coleção</a>
                    <a className="transition-all" href="#projects">Perfil</a>
                    <a href="" target="_blank">
                        <div className="border-solid rounded-md border p-3 text-amber-800 hover:text-white transition-all">
                            Login
                        </div>
                    </a>
                </div>
            )}
    </header>
  )
}

export default Header
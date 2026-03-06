const SearchBar = () => {
    return (
        <div className="flex items-center pb-10">
            <input type="text" placeholder="Procure pela carta..." className="outline-0 bg-white border-0 p-2 rounded-l-2xl" />
            <div className="bg-white p-2 rounded-r-2xl text-amber-800">
                <i className="fa-solid fa-magnifying-glass"></i>
            </div>
        </div>
    )
}

export default SearchBar
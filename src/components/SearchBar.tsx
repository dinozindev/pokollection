type SearchBarProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SearchBar = ({ value, onChange, onSubmit }: SearchBarProps) => {
    return (
        <form onSubmit={onSubmit}>
            <div className="flex items-center">
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder="Procure pela carta..."
                    className="outline-0 bg-white border-0 p-2 rounded-l-2xl md:p-3"
                />
                <button
                    type="submit"
                    className="bg-white p-2 rounded-r-2xl text-amber-800 md:p-3 cursor-pointer"
                >
                    <i className="fa-solid fa-magnifying-glass hover:text-black"></i>
                </button>
            </div>
        </form>
    )
}

export default SearchBar;
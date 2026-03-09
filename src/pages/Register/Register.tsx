const Register = () => {
    return (
        <section className="flex flex-col justify-center items-center h-screen">
            <h2 className="text-3xl">Cadastro</h2>
            <form className="flex flex-col py-8 gap-3">
                <label htmlFor="input__username">Nome de usuário</label>
                <input id="input__username" className="border-1 rounded-xl px-2 py-1" type="text" />
                <label htmlFor="input__email">Email</label>
                <input id="input__email" className="border-1 rounded-xl px-2 py-1" type="text" />
                <label htmlFor="input__senha">Senha</label>
                <input id="input__senha" className="border-1 rounded-xl px-2 py-1" type="password" />
                <button
                    type="submit"
                    className="bg-transparent p-2 mt-4 rounded-2xl border-amber-800 border-2 text-amber-800"
                >
                    Cadastrar
                </button>
            </form>
        </section>
    )
}

export default Register
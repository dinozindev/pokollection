import { Link } from "react-router-dom";

const Login = () => {
  return (
    <section className="flex flex-col justify-center items-center h-screen">
      <h2 className="text-3xl">Login</h2>
      <form className="flex flex-col py-8 gap-3 w-2/3">
        <label htmlFor="input__email">Email</label>
        <input id="input__email" className="border-1 rounded-xl px-2 py-1" type="text" />
        <label htmlFor="input__senha">Senha</label>
        <input id="input__senha" className="border-1 rounded-xl px-2 py-1" type="password" />
        <button
          type="submit"
          className="bg-transparent p-2 mt-4 rounded-2xl border-amber-800 border-2 text-amber-800"
        >
          Login
        </button>
      </form>
      <p>Não possui cadastro? <Link to="/register" className="text-amber-800">Cadastre-se!</Link></p>
    </section>
  );
};

export default Login;
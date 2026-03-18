import { Link, useNavigate } from "react-router-dom";
import type { User } from "../../types/type";
import { useState } from "react";
import * as firebase from "firebase/auth";
import { auth } from "../../firebase/firebase";

const Login = () => {
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
    username: ""
  })
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
          try {
              const response = await firebase.signInWithEmailAndPassword(
                  auth,
                  user.email,
                  user.password
              );
              console.log(response.user);
              setError(false);
              navigate("/cards");
          } catch (error) {
              console.error(error);
              setError(true);
          }
      };

  return (
    <section className="flex flex-col justify-center items-center h-screen">
      <h2 className="text-3xl">Login</h2>
      <form onSubmit={doLogin} className="flex flex-col py-8 gap-3 w-2/3">
        <label htmlFor="input__email">Email</label>
        <input id="input__email" className="border rounded-xl px-2 py-1" type="text" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} />
        <label htmlFor="input__senha">Senha</label>
        <input id="input__senha" className="border rounded-xl px-2 py-1" type="password" value={user.password} onChange={(e) => setUser({...user, password: e.target.value})} />
        {error && (
                    <span className="text-red-500">E-mail ou senha incorreto(s).</span>
                )}
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
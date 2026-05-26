import { Link, useNavigate } from "react-router-dom";
import type { User } from "../../types/type";
import { useState } from "react";
import * as firebase from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

const Login = () => {
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
    username: ""
  });

  const [error, setError] = useState<string>("");
  const [alert, setAlert] = useState<string>("");

  const navigate = useNavigate();

  // Realiza login
  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    try {
      const response = await firebase.signInWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );

      // atualiza dados do usuário
      await response.user.reload();

      // verifica confirmação de email
      if (!response.user.emailVerified) {
        await auth.signOut();

        setError("Verifique seu e-mail antes de entrar. E-mail reenviado.");
        await firebase.sendEmailVerification(response.user);

        return;
      }

      const userRef = doc(db, "users", response.user.uid);

      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          username: response.user.displayName || "",
          email: response.user.email,
          favoritePokemon: "",
          avatar: "",
          createdAt: serverTimestamp(),
          bio: "",
          favoriteType: "",
          favoriteGen: ""
        });
      }
      
      navigate("/cards", {
        state: { loggedIn: true }
      });

    } catch (error: any) {
      console.error(error);

      switch (error.code) {
        case "auth/invalid-credential":
          setError("E-mail ou senha incorretos.");
          break;

        case "auth/too-many-requests":
          setError("Muitas tentativas. Tente novamente mais tarde.");
          break;

        case "auth/network-request-failed":
          setError("Erro de conexão.");
          break;

        default:
          setError("Erro ao realizar login.");
      }
    }
  };

  const forgotPassword = async () => {
    if (!user.email) {
      setError("Digite seu e-mail.");
      return;
    }

    try {
      await firebase.sendPasswordResetEmail(auth, user.email);

      setError("");

      setAlert("E-mail de recuperação enviado. Verifique sua caixa de spam.");
      setTimeout(() => setAlert(""), 5000);

    } catch (error: any) {
      console.error(error);

      switch (error.code) {
        case "auth/user-not-found":
          setError("Nenhuma conta encontrada com este e-mail.");
          break;

        case "auth/invalid-email":
          setError("E-mail inválido.");
          break;

        default:
          setError("Erro ao enviar recuperação.");
      }
    }
  };

  return (
    <section className="flex flex-col justify-center items-center h-screen">
      <h2 className="text-3xl">Login</h2>

      <form
        onSubmit={doLogin}
        className="flex flex-col py-8 gap-6 w-2/3 lg:w-1/4"
      >
        <input
          id="input__email"
          className="rounded-2xl px-2 py-3 bg-white"
          type="email"
          value={user.email}
          onChange={(e) =>
            setUser({ ...user, email: e.target.value })
          }
          required
          placeholder="Email"
        />
        <input
          id="input__senha"
          className="rounded-2xl px-2 py-3 bg-white"
          type="password"
          value={user.password}
          onChange={(e) =>
            setUser({ ...user, password: e.target.value })
          }
          required
          placeholder="Senha"
        />

        {error && (
          <span className="text-red-500 text-center">
            {error}
          </span>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            className="
              bg-transparent
              p-2 mt-4
              rounded-2xl
              border-amber-800 border-2
              text-amber-800
              hover:text-black
              hover:border-black
              transition-all
              cursor-pointer
              w-2/4
            "
          >
            Login
          </button>
        </div>
      </form>

      <p>
        Não possui cadastro?{" "}
        <Link
          to="/register"
          className="text-amber-800 hover:text-black hover:underline transition-all"
        >
          Cadastre-se!
        </Link>
      </p>

      <p
        onClick={forgotPassword}
        className="
        text-amber-800
        hover:text-black
        hover:underline
        transition-all
        cursor-pointer
        mt-2
    "
      >
        Esqueceu a senha?
      </p>
      {alert && (
        <div className="fixed bg-white text-black px-4 py-4 rounded-lg shadow-lg z-20 transition-all text-xl top-30">
          {alert}
        </div>
      )}
    </section>
  );
};

export default Login;
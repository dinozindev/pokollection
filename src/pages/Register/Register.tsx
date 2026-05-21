import { useState } from "react"
import type { User } from "../../types/type";
import * as firebase from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const Register = () => {

    const [user, setUser] = useState<User>({
        email: "",
        password: "",
        username: ""
    });
    const [error, setError] = useState<string>("");
    const [alert, setAlert] = useState<string>("");
    const navigate = useNavigate();

    // Cria uma nova conta no Firebase Auth
    const createAccount = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");

        if (user.username.length < 6) {
            setError(
                "O nome de usuário deve ter pelo menos 6 caracteres."
            );
            return;
        }

        try {
            const response = await firebase.createUserWithEmailAndPassword(
                auth,
                user.email,
                user.password
            );

            await firebase.sendEmailVerification(response.user);

            await setDoc(doc(db, "users", response.user.uid), {
                username: user.username,
                email: user.email,
                favoritePokemon: "",
                avatar: "",
                createdAt: serverTimestamp(),
                bio: "",
                favoriteType: "",
                favoriteGen: ""
            })

            setAlert("Verifique seu e-mail para ativar sua conta.");
            setTimeout(() => setAlert(""), 5000);

            navigate("/cards");

        } catch (error: any) {
            console.error(error);

            switch (error.code) {
                case "auth/email-already-in-use":
                    setError("Este e-mail já está em uso.");
                    break;
                case "auth/invalid-email":
                    setError("Formato de e-mail inválido.");
                    break;
                case "auth/weak-password":
                    setError("A senha deve ter pelo menos 6 caracteres.");
                    break;
                default:
                    setError("Ocorreu um erro ao criar a conta.")
            }

        }
    };

    return (
        <section className="flex flex-col justify-center items-center h-screen">
            <h2 className="text-3xl">Cadastro</h2>
            <form onSubmit={createAccount} className="flex flex-col py-8 gap-6 w-2/3 lg:w-1/4">
                <input
                    id="input__username"
                    className="rounded-2xl px-2 py-3 bg-white"
                    type="text"
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    required
                    placeholder="Nome de Usuário"
                />
                <input
                    id="input__email"
                    className="rounded-2xl px-2 py-3 bg-white"
                    type="text"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    required
                    placeholder="Email"
                />
                <input
                    id="input__senha"
                    className="rounded-2xl px-2 py-3 bg-white"
                    type="password"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    required
                    placeholder="Senha"
                />
                {error && (
                    <span className="text-red-500 text-center">{error}</span>
                )}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-transparent p-2 mt-4 rounded-2xl border-amber-800 border-2 text-amber-800 hover:text-black hover:border-black transition-all cursor-pointer w-2/4"
                    >
                        Cadastrar
                    </button>
                </div>
                {alert && (
                    <div className="fixed bg-white text-black px-4 py-4 rounded-lg shadow-lg z-20 transition-all text-xl top-30">
                        {alert}
                    </div>
                )}
            </form>
        </section>
    )
}

export default Register
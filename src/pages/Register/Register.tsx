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
    const [error, setError] = useState<boolean>(false);
    const navigate = useNavigate();

    // Cria uma nova conta no Firebase Auth
    const createAccount = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await firebase.createUserWithEmailAndPassword(
                auth,
                user.email,
                user.password
            );

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
            <h2 className="text-3xl">Cadastro</h2>
            <form onSubmit={createAccount} className="flex flex-col py-8 gap-3 w-2/3 lg:w-1/4">
                <label htmlFor="input__username">Nome de usuário</label>
                <input
                    id="input__username"
                    className="border rounded-xl px-2 py-1"
                    type="text"
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                />
                <label htmlFor="input__email">Email</label>
                <input
                    id="input__email"
                    className="border rounded-xl px-2 py-1"
                    type="text"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                <label htmlFor="input__senha">Senha</label>
                <input
                    id="input__senha"
                    className="border rounded-xl px-2 py-1"
                    type="password"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                />
                {error && (
                    <span className="text-red-500">E-mail informado já está sendo utilizado.</span>
                )}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-transparent p-2 mt-4 rounded-2xl border-amber-800 border-2 text-amber-800 hover:text-black hover:border-black transition-all cursor-pointer w-2/4"
                    >
                        Cadastrar
                    </button>
                </div>
            </form>
        </section>
    )
}

export default Register
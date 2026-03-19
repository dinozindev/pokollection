import { useContext, useEffect, useState } from "react";
import profileImage from "../../assets/profile-placeholder.png";
import { AuthContext } from "../../context/AuthContext";
import { collection, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { type ProfileInfo, type CardUser } from "../../types/type";
import ProfileCard from "../../components/ProfileCard";
import { Link } from "react-router-dom";


const Profile = () => {
    const { user } = useContext(AuthContext);

    const [userForm, setUserForm] = useState<ProfileInfo>({
        username: "",
        favoritePokemon: "",
        avatar: ""
    });
    const [userData, setUserData] = useState<any>();
    const [userCards, setUserCards] = useState<CardUser[]>([]);
    const [cardCount, setCardCount] = useState<number>(0);
    const [editMenu, setEditMenu] = useState<boolean>(false);

    // Obtém as informações do usuário existente
    const fetchUserInfo = async () => {
        if (!user) return;

        const docRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(docRef);
        console.log("snapshot", snapshot.exists(), snapshot.data());
        if (snapshot.exists()) {
            setUserData(snapshot.data());
        }

    }

    // Preenche os dados automaticamente com os existentes no banco de dados
    const handleEditClick = () => {
        setUserForm({
            username: userData?.username || "",
            favoritePokemon: userData?.favoritePokemon || "",
            avatar: userData?.avatar || ""
        });
        setEditMenu(true);
    };

    // Atualiza os dados do usuário no banco de dados
    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.uid) return;

        try {
            const docRef = doc(db, "users", user.uid);
            await updateDoc(docRef, {
                username: userForm.username,
                favoritePokemon: userForm.favoritePokemon,
                avatar: userForm.avatar
            });

            setUserData((prev: any) => ({ ...prev, ...userForm }));

            setEditMenu(false);

        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            alert("Erro ao salvar alterações.");
        }
    };

    useEffect(() => {
        if (!user) return;
        fetchUserInfo();

        const cardsRef = collection(db, "users", user.uid, "cards");

        const unsubscribe = onSnapshot(cardsRef, (snapshot) => {
            const cards: CardUser[] = snapshot.docs.map((doc) => ({
                ...(doc.data() as CardUser),
                id: doc.id
            }));
            setUserCards(cards);

            const total = cards.reduce((sum, card) => sum + (card.quantity ?? 0), 0);
            setCardCount(total);
        });

        return () => unsubscribe();

    }, [user])

    return (
        <section className="pt-30 flex flex-col items-center">
            <img src={profileImage} className="rounded-full w-1/2 absolute" />
            <div className={`bg-white w-4/5 p-4 z-10 gap-4 ${editMenu ? "fixed" : "hidden"}`}>
                <div className="flex justify-between items-center">
                    <p className="text-xl">Editar Perfil</p>
                    <i className="fa-solid fa-xmark text-2xl" onClick={() => setEditMenu(false)}></i>
                </div>
                <form onSubmit={updateProfile} className="flex flex-col gap-3 mt-4">
                    <label htmlFor="input__username">Nome de usuário</label>
                    <input
                        id="input__username"
                        type="text"
                        placeholder="Nome de usuário"
                        className="border p-2 rounded"
                        value={userForm.username}
                        onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                    />
                    <label htmlFor="input__favoritepkmn">Pokémon favorito</label>
                    <input
                        id="input__favoritepkmn"
                        type="text"
                        placeholder="Pokémon favorito"
                        className="border p-2 rounded"
                        value={userForm.favoritePokemon}
                        onChange={(e) => setUserForm({ ...userForm, favoritePokemon: e.target.value })}
                    />
                    <button
                        type="submit"
                        className="bg-transparent p-2 mt-4 rounded-2xl border-amber-800 border-2 text-amber-800"
                    >
                        Atualizar perfil
                    </button>
                </form>
            </div>
            <div className="flex flex-col items-center gap-4 bg-gray-100 h-screen rounded-t-4xl mt-30 pt-30 w-full">
                <div className="flex items-center gap-2">
                    <h3 className="text-2xl">{userData?.username}</h3>
                    <i className="fa-solid fa-pen-to-square cursor-pointer" onClick={handleEditClick}></i>
                </div>

                <p className="opacity-50">{userData?.email}</p>
                <div className="flex justify-center flex-wrap mt-4 mx-4 text-xl">
                    <ProfileCard>
                        <p className="h-1/2">Cartas</p>
                        <div className="flex justify-end items-end h-1/2">
                            <p className="text-6xl text-amber-800 font-semibold">{cardCount}</p>
                        </div>
                    </ProfileCard>
                    <ProfileCard>
                        <p className="h-1/2">Pokémon favorito</p>
                        <div className="flex justify-end items-end h-1/2">
                            <p className="text-3xl text-amber-800 font-semibold">{userData?.favoritePokemon != "" ? userData?.favoritePokemon : "Nenhum"}</p>
                        </div>
                    </ProfileCard>
                    <ProfileCard>
                        <p>Outro card</p>
                    </ProfileCard>
                    <ProfileCard>
                        <p>Outro card</p>
                    </ProfileCard>
                </div>
                <div className="flex gap-2 mt-4 mx-4 w-full items-center">
                    <Link to="/favorites" className="flex border border-gray-300 text-xl px-4 py-2 ml-4 w-1/2 items-center justify-between">
                        <p>Favoritos</p>
                        <i className="fa-solid fa-star text-amber-300"></i>
                    </Link>
                    <Link to="/collection" className="flex border border-gray-300 text-xl px-4 py-2 mr-4 w-1/2 items-center justify-between">
                        <p>Coleção</p>
                        <i className="fa-solid fa-layer-group text-amber-800"></i></Link>
                </div>
            </div>
        </section >
    )
}

export default Profile
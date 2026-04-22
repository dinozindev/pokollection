import { useContext, useEffect, useState } from "react";
import profileImage from "../../assets/profile-placeholder.png";
import { AuthContext } from "../../context/AuthContext";
import { collection, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { type ProfileInfo, type CardUser } from "../../types/type";
import ProfileCard from "../../components/ProfileCard";
import { Link } from "react-router-dom";
import types from "../../../pokemonTypes.json";


const Profile = () => {
    const { user } = useContext(AuthContext);

    const [userForm, setUserForm] = useState<ProfileInfo>({
        username: "",
        favoritePokemon: "",
        avatar: "",
        bio: "",
        favoriteType: "",
        favoriteGen: ""
    });
    const [userData, setUserData] = useState<any>();
    // const [userCards, setUserCards] = useState<CardUser[]>([]);
    const [cardCount, setCardCount] = useState<number>(0);
    const [editMenu, setEditMenu] = useState<boolean>(false);
    const [showUpdate, setShowUpdate] = useState<boolean>(false);

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

    // gerencia o tipo favorito do usuário
    // const selectedType = types.find(
    //     (t) => t.name.trim().toLowerCase() === userData?.favoriteType?.trim().toLowerCase()
    // );

    // Preenche os dados automaticamente com os existentes no banco de dados
    const handleEditClick = () => {
        setUserForm({
            username: userData?.username || "",
            favoritePokemon: userData?.favoritePokemon || "",
            avatar: userData?.avatar || "",
            bio: userData?.bio || "",
            favoriteType: userData?.favoriteType || "",
            favoriteGen: userData?.favoriteGen || ""
        });
        setEditMenu(true);
    };

    // Converte a imagem de perfil para Base64 para que possa ser armazenada no firestore
    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        })
    }

    // transforma em base64 a imagem quando for dado upload
    const handleImageChange = async (e: any) => {
        const file = e.target.files[0];

        if (!file) return;

        const base64 = await convertToBase64(file);

        setUserForm({
            ...userForm,
            avatar: base64
        });
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
                avatar: userForm.avatar,
                bio: userForm.bio,
                favoriteType: userForm.favoriteType,
                favoriteGen: userForm.favoriteGen
            });

            setUserData((prev: any) => ({ ...prev, ...userForm }));

            setEditMenu(false);

            setShowUpdate(true);

            setTimeout(() => {
                setShowUpdate(false);
            }, 3000)

        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            alert("Erro ao salvar alterações.");
        }
    };

    // busca todas as cartas salvas do usuário e contabiliza elas em um estado de total
    useEffect(() => {
        if (!user) return;
        fetchUserInfo();

        const cardsRef = collection(db, "users", user.uid, "cards");

        const unsubscribe = onSnapshot(cardsRef, (snapshot) => {
            const cards: CardUser[] = snapshot.docs.map((doc) => ({
                ...(doc.data() as CardUser),
                id: doc.id
            }));
            // setUserCards(cards);

            const total = cards.reduce((sum, card) => sum + (card.quantity ?? 0), 0);
            setCardCount(total);
        });

        return () => unsubscribe();

    }, [user])

    return (
        <section className="pt-4 flex flex-col items-center">
            <div className="relative w-60 h-60 min-w-60 min-h-60 top-55">
                <img
                    src={userData?.avatar || profileImage}
                    className="rounded-full w-full h-full object-cover shadow-lg border-4 border-white"
                    alt="Profile Avatar"
                />
            </div>
            {editMenu && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Fundo embaçado */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setEditMenu(false)}
                    ></div>
                    {/* Pop-up de edição */}
                    <div className="relative bg-white w-4/5 max-w-md p-4 rounded-2xl shadow-lg z-10">
                        <div className="flex justify-between items-center">
                            <p className="text-xl">Editar Perfil</p>
                            <i
                                className="fa-solid fa-xmark text-2xl cursor-pointer hover:text-amber-800 transition-all"
                                onClick={() => setEditMenu(false)}
                            ></i>
                        </div>
                        <form onSubmit={updateProfile} className="flex flex-col gap-3 mt-4" id="form__update">
                            <label htmlFor="input__username">Nome de usuário</label>
                            <input
                                id="input__username"
                                type="text"
                                className="border p-2 rounded"
                                value={userForm.username}
                                onChange={(e) =>
                                    setUserForm({ ...userForm, username: e.target.value })
                                }
                            />
                            <label htmlFor="input__favoritepkmn">Pokémon favorito</label>
                            <input
                                id="input__favoritepkmn"
                                type="text"
                                className="border p-2 rounded"
                                value={userForm.favoritePokemon}
                                onChange={(e) =>
                                    setUserForm({
                                        ...userForm,
                                        favoritePokemon: e.target.value,
                                    })
                                }
                            />
                            <label htmlFor="input__profilepicture">Imagem de Perfil (.png ou .jpeg)</label>
                            <input
                                id="input__profilepicture"
                                type="file"
                                accept="image/png, image/jpeg"
                                className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-lg file:border-2
                                        file:text-sm file:font-semibold
                                        file:border-amber-800 file:text-amber-800
                                        hover:file:text-black hover:file:border-black transition-all file:cursor-pointer"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="input__bio">Bio</label>
                            <input
                                id="input__bio"
                                type="text"
                                className="border p-2 rounded field-sizing-content h-40"
                                value={userForm.bio}
                                onChange={(e) =>
                                    setUserForm({
                                        ...userForm,
                                        bio: e.target.value,
                                    })
                                }
                            />
                            <label htmlFor="select__type">Tipo Favorito</label>
                            <select
                                name="types"
                                id="select__type"
                                form="form__update"
                                value={userForm.favoriteType || ""} 
                                onChange={(e) => setUserForm({
                                    ...userForm,
                                    favoriteType: e.target.value
                                })}
                                className="border p-2 rounded"
                            >
                                <option value="" disabled selected hidden>-- Selecione um tipo --</option>
                                {types.map(type => (
                                    <option key={type.name} value={type.name}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            <label htmlFor="select__gen">Geração Favorita</label>
                            <select
                                name="gens"
                                id="select__gen"
                                form="form__update"
                                value={userForm.favoriteGen || ""}
                                onChange={(e) => setUserForm({
                                    ...userForm,
                                    favoriteGen: e.target.value
                                })}
                                className="border p-2 rounded">
                                <option value="" disabled selected hidden>-- Selecione uma geração --</option>
                                <option key="gen1" value="Gen I">Gen I (Kanto)</option>
                                <option key="gen2" value="Gen II">Gen II (Johto)</option>
                                <option key="gen3" value="Gen III">Gen III (Hoenn)</option>
                                <option key="gen4" value="Gen IV">Gen IV (Sinnoh)</option>
                                <option key="gen5" value="Gen V">Gen V (Unova)</option>
                                <option key="gen6" value="Gen VI">Gen VI (Kalos)</option>
                                <option key="gen7" value="Gen VII">Gen VII (Alola)</option>
                                <option key="gen8" value="Gen VIII">Gen VIII (Galar)</option>
                                <option key="gen9" value="Gen IX">Gen IX (Paldea)</option>
                            </select>
                            <button
                                type="submit"
                                className="bg-transparent p-2 mt-4 rounded-2xl border-amber-800 border-2 text-amber-800 cursor-pointer hover:text-black hover:border-black transition-all"
                            >
                                Atualizar perfil
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <div className="flex flex-col items-center gap-4 bg-gray-100 h-screen rounded-t-4xl mt-30 pt-30 w-full">
                <div className="flex items-center gap-2">
                    <h3 className="text-3xl">{userData?.username}</h3>
                    <i className="fa-solid fa-pen-to-square cursor-pointer hover:text-amber-800 transition-all md:text-xl" onClick={handleEditClick}></i>
                </div>
                <p className="opacity-50">{userData?.email}</p>
                <p>{userData?.bio || "Nenhuma informação"}</p>
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
                            <p className="text-2xl md:text-4xl text-amber-800 font-semibold">{userData?.favoritePokemon || "Nenhum"}</p>
                        </div>
                    </ProfileCard>
                    <ProfileCard>
                        <p className="h-1/2">Tipo Favorito</p>
                        <div className="flex justify-end items-center h-1/2 gap-2">
                            <p className="text-2xl md:text-4xl text-amber-800 font-semibold">
                                {userData?.favoriteType || "Nenhum"}
                            </p>
                            {/* {selectedType && (
                                <img
                                    className="w-10 md:w-12 object-contain"
                                    src={selectedType.image}
                                    alt={selectedType.name}
                                />
                            )} */}
                        </div>
                    </ProfileCard>
                    <ProfileCard>
                        <p className="h-1/2">Geração Favorita</p>
                        <div className="flex justify-end items-center h-1/2 gap-2">
                            <p className="text-2xl md:text-4xl text-amber-800 font-semibold">{userData?.favoriteGen || "Nenhuma"}</p>
                        </div>
                    </ProfileCard>
                </div>
                <div className="flex gap-2 mt-4 mx-4 w-full items-center lg:w-2/5">
                    <Link to="/favorites" className="flex border border-gray-300 text-xl px-4 py-2 md:py-6 ml-4 w-1/3 items-center justify-between hover:border-amber-800 transition-all">
                        <p>Favoritos</p>
                        <i className="fa-solid fa-star text-amber-300"></i>
                    </Link>
                    <Link to="/collection" className="flex border border-gray-300 text-xl px-4 py-2 md:py-6 w-1/3 items-center justify-between hover:border-amber-800 transition-all">
                        <p>Coleção</p>
                        <i className="fa-solid fa-layer-group text-amber-800"></i></Link>
                    <Link to="/binders" className="flex border border-gray-300 text-xl px-4 py-2 md:py-6 mr-4 w-1/3 items-center justify-between hover:border-amber-800 transition-all">
                        <p>Binders</p>
                        <i className="fa-solid fa-folder text-amber-800"></i></Link>
                </div>
            </div>
            {showUpdate && (
                <div className="fixed bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in z-20">
                    Perfil salvo com sucesso!
                </div>
            )}
        </section >
    )
}

export default Profile
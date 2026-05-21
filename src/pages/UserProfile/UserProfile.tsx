import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext";
import { collection, doc, getDoc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import type { CardUser, CompleteUser } from "../../types/type";
import ProfileCard from "../../components/ProfileCard";
import profileImage from "../../assets/profile-placeholder.png";
import { useFriends } from "../../hooks/useFriends";

const UserProfile = () => {
    const { id } = useParams();
    if (!id) return;
    const { user } = useContext(AuthContext);
    const { toggleFollow } = useFriends();
    const [userData, setUserData] = useState<any>();
    const [cardCount, setCardCount] = useState<number>();
    const [following, setFollowing] = useState<boolean>(false);

    const [followingList, setFollowingList] = useState<CompleteUser[]>([]);
    const [followingCount, setFollowingCount] = useState<number>(0);

    const [followers, setFollowers] = useState<CompleteUser[]>([]);
    const [followersCount, setFollowersCount] = useState<number>(0);

    const fetchUserInfo = async () => {
        if (!user) return;

        const docRef = doc(db, "users", id);
        const snapshot = await getDoc(docRef);
        console.log("snapshot", snapshot.exists(), snapshot.data());
        if (snapshot.exists()) {
            setUserData({
                ...(snapshot.data()),
                id: snapshot.id
            });
        }
    }

    // busca dados do perfil acessado
    useEffect(() => {
        if (!id) return;

        fetchUserInfo();
    }, [id]);

    // verifica se o usuário segue o perfil acessado
    useEffect(() => {
        if (!user || !id) return;

        const followingRef = doc(
            db,
            "users",
            user.uid,
            "following",
            id
        );

        const unsubscribe = onSnapshot(followingRef, (snapshot) => {
            setFollowing(snapshot.exists());
        });

        return () => unsubscribe();
    }, [user, id]);

    // followers em tempo real
    useEffect(() => {
        if (!id) return;

        const followersRef = collection(
            db,
            "users",
            id,
            "followers"
        );

        const unsubscribe = onSnapshot(followersRef, async (snapshot) => {
            const followersUids = snapshot.docs.map(
                doc => doc.data().uid
            );

            const followersData = await Promise.all(
                followersUids.map(async (uid) => {
                    const userDoc = await getDoc(doc(db, "users", uid));

                    return {
                        id: userDoc.id,
                        ...userDoc.data()
                    };
                })
            );

            setFollowers(followersData as CompleteUser[]);
            setFollowersCount(followersData.length);
        });

        return () => unsubscribe();
    }, [id]);

    // following em tempo real
    useEffect(() => {
        if (!id) return;

        const followingRef = collection(
            db,
            "users",
            id,
            "following"
        );

        const unsubscribe = onSnapshot(followingRef, async (snapshot) => {
            const followingUids = snapshot.docs.map(
                doc => doc.data().uid
            );

            const followingData = await Promise.all(
                followingUids.map(async (uid) => {
                    const userDoc = await getDoc(doc(db, "users", uid));

                    return {
                        id: userDoc.id,
                        ...userDoc.data()
                    };
                })
            );

            setFollowingList(followingData as CompleteUser[]);
            setFollowingCount(followingData.length);
        });

        return () => unsubscribe();
    }, [id]);

    // cartas em tempo real
    useEffect(() => {
        if (!id) return;

        const cardsRef = collection(db, "users", id, "cards");

        const unsubscribe = onSnapshot(cardsRef, (snapshot) => {
            const cards: CardUser[] = snapshot.docs.map((doc) => ({
                ...(doc.data() as CardUser),
                id: doc.id
            }));

            const total = cards.reduce(
                (sum, card) => sum + (card.quantity ?? 0),
                0
            );

            setCardCount(total);
        });

        return () => unsubscribe();
    }, [id]);

    // useEffect(() => {
    //     if (!user || !id) return;

    //     const followingRef = doc(
    //         db,
    //         "users",
    //         user.uid,
    //         "following",
    //         id
    //     );

    //     const unsubscribe = onSnapshot(followingRef, (snapshot) => {
    //         setFollowing(snapshot.exists());
    //     });

    //     return () => unsubscribe();
    // }, [user, id]);

    // useEffect(() => {
    //     if (!user) return;
    //     fetchUserInfo();
    //     fetchFollowers();
    //     fetchFollowing();

    //     const cardsRef = collection(db, "users", id, "cards");

    //     const unsubscribe = onSnapshot(cardsRef, (snapshot) => {
    //         const cards: CardUser[] = snapshot.docs.map((doc) => ({
    //             ...(doc.data() as CardUser),
    //             id: doc.id
    //         }));
    //         const total = cards.reduce((sum, card) => sum + (card.quantity ?? 0), 0);
    //         setCardCount(total);
    //     });

    //     return () => unsubscribe();

    // }, [user])

    return (
        <section className="pt-4 flex flex-col items-center">
            <div className="relative w-60 h-60 min-w-60 min-h-60 top-55">
                <img
                    src={userData?.avatar || profileImage}
                    className="rounded-full w-full h-full object-cover shadow-lg border-4 border-white"
                    alt="Profile Avatar"
                />
            </div>
            <div className="flex flex-col items-center gap-4 bg-gray-100 h-screen rounded-t-4xl mt-30 pt-30 w-full">
                <div className="flex items-center gap-4 p-1">
                    <h3 className="text-3xl">{userData?.username}</h3>
                    <div
                        onClick={() => toggleFollow(userData)}
                        className={`shadow-2xl py-2 px-4 font-medium rounded-2xl cursor-pointer transition-all ${following ? "bg-amber-800 text-white hover:text-amber-800 hover:bg-white" : "bg-white text-amber-800 hover:bg-amber-800 hover:text-white"} `}
                    >
                        {following ? "Seguindo" : "Seguir"}
                    </div>
                </div>
                <div className="flex w-9/10 md:w-1/4 gap-4 justify-center">
                    <div className="flex gap-1.5 text-md p-2 md:py-3 items-center justify-center hover:border-amber-800 transition-all">
                        <span className="text-amber-800 font-bold">{followingCount}</span>
                        <p>Seguindo</p>
                    </div>
                    <div className="flex gap-1.5 text-md p-2 md:py-3 items-center justify-center hover:border-amber-800 transition-all">
                        <span className="text-amber-800 font-bold">{followersCount}</span>
                        <p>Seguidores</p>
                    </div>
                </div>
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
                        </div>
                    </ProfileCard>
                    <ProfileCard>
                        <p className="h-1/2">Geração Favorita</p>
                        <div className="flex justify-end items-center h-1/2 gap-2">
                            <p className="text-2xl md:text-4xl text-amber-800 font-semibold">{userData?.favoriteGen || "Nenhuma"}</p>
                        </div>
                    </ProfileCard>
                </div>
                <div className="flex flex-wrap md:flex-nowrap gap-2 mt-4 mx-4 w-full items-center justify-center lg:w-2/5">
                    <Link to="/favorites" className="flex border border-gray-300 text-xl px-4 py-2 md:py-6 w-1/3 items-center justify-between hover:border-amber-800 transition-all">
                        <p>Favoritos</p>
                        <i className="fa-solid fa-star text-amber-300"></i>
                    </Link>
                    <Link to="/collection" className="flex border border-gray-300 text-xl px-4 py-2 md:py-6 w-1/3 items-center justify-between hover:border-amber-800 transition-all">
                        <p>Coleção</p>
                        <i className="fa-solid fa-layer-group text-amber-800"></i></Link>
                    <Link to="/binders" className="flex border border-gray-300 text-xl px-4 py-2 md:py-6 w-1/3 items-center justify-between hover:border-amber-800 transition-all">
                        <p>Binders</p>
                        <i className="fa-solid fa-folder text-amber-800"></i></Link>
                </div>
            </div>
        </section>
    )
}

export default UserProfile
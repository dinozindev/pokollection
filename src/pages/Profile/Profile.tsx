import { useContext, useEffect, useState } from "react";
import profileImage from "../../assets/profile-placeholder.png";
import { AuthContext } from "../../context/AuthContext";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import type { CardUser } from "../../types/type";
import ProfileCard from "../../components/ProfileCard";


const Profile = () => {
    const { user } = useContext(AuthContext);

    const [userData, setUserData] = useState<any>();
    const [userCards, setUserCards] = useState<CardUser[]>([]);
    const [cardCount, setCardCount] = useState<number>(0);

    const fetchUserInfo = async () => {
        if (!user) return;

        const docRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(docRef);
        console.log("snapshot", snapshot.exists(), snapshot.data());
        if (snapshot.exists()) {
            setUserData(snapshot.data());
        }

    }

    useEffect(() => {

    }, [user]);


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
            <div className="flex flex-col items-center gap-4 bg-gray-100 h-screen rounded-t-4xl mt-30 pt-30 w-full">
                <h3 className="text-2xl">{userData?.username}</h3>
                <p className="opacity-50">{userData?.email}</p>
                <div className="flex justify-center flex-wrap mt-4 mx-4 text-xl">
                    <ProfileCard>
                        <p className="h-1/2">Cartas</p>
                        <div className="flex justify-end h-1/2">
                            <p className="text-4xl text-amber-800 font-semibold">{cardCount}</p>
                        </div>
                    </ProfileCard>
                    <ProfileCard>
                        <p>Pokémon favorito: {userData?.favoritePokemon ?? "Nenhum"}</p>
                    </ProfileCard>
                    <ProfileCard>
                        <p>Outro card</p>
                    </ProfileCard>
                    <ProfileCard>
                        <p>Outro card</p>
                    </ProfileCard>
                </div>
            </div>
        </section>
    )
}

export default Profile
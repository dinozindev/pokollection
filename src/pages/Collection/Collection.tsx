import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import type { CardUser } from "../../types/type";
import { useCards } from "../../hooks/useCards";
import CardDiv from "../../components/CardDiv";
import { useParams } from "react-router-dom";

const Collection = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    if (!user) return;
    const { addCard, removeCard } = useCards();
    const [userCards, setUserCards] = useState<CardUser[]>([]);
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
    const [showBinderWindow, setShowBinderWindow] = useState<boolean>(false);
    const [binderMessage, setBinderMessage] = useState<string>("");

    const targetUid = id || user.uid;
    const isOwnProfile = !id;

    const handleImageLoad = (id: string) => {
        setLoadedImages((prev) => ({
            ...prev,
            [id]: true
        }));
    };

    const handleBinderSuccess = (message: string) => {
        setBinderMessage(message);
        setShowBinderWindow(true);
        setTimeout(() => setShowBinderWindow(false), 5000);
    };

    useEffect(() => {
        if (!user) return;
        const cardsRef = collection(db, "users", targetUid, "cards");

        const unsubscribe = onSnapshot(cardsRef, (snapshot) => {
            const cards: CardUser[] = snapshot.docs.map(
                (doc) => ({
                    ...(doc.data() as CardUser),
                    id: doc.id
                }))
                .sort((a, b) => {
                    const aTime = a.createdAt instanceof Timestamp ? a.createdAt?.toMillis() : 0;
                    const bTime = b.createdAt instanceof Timestamp ? b.createdAt?.toMillis() : 0;
                    return bTime - aTime;
                });

            setUserCards(cards);
        });


        return () => unsubscribe();
    }, [targetUid]);


    return (
        <section className="flex items-center py-30 flex-col min-h-screen">
            <h2 className="text-4xl font-medium text-amber-800 mt-4 bg-white p-4 rounded-xl shadow-xl">{isOwnProfile ? "Minha Coleção" : "Coleção"}</h2>
            <div className="flex items-center pb-10 gap-3">
            </div>
            <div className={`flex flex-wrap justify-center gap-6 ${userCards.length <= 2 ? "w-full" : ""}`}>
                {userCards.length !== 0 ? userCards?.map(card => (
                    isOwnProfile
                        ?
                        <CardDiv key={card.id} loadedImages={loadedImages} card={card} handleImageLoad={handleImageLoad} removeCard={removeCard} addCard={addCard} userCards={userCards} addToBinder={!!user} onBinderSuccess={handleBinderSuccess} />
                        :
                        <CardDiv key={card.id} loadedImages={loadedImages} card={card} handleImageLoad={handleImageLoad} userCards={userCards} />
                )) : <p>{isOwnProfile ? "Nenhuma carta em sua coleção ainda!" : "Nenhuma carta na coleção!"}</p>}
            </div>
            {showBinderWindow && (
                <div className="fixed bg-white text-black px-4 py-4 rounded-lg shadow-lg z-20 transition-all text-xl">
                    {binderMessage}
                </div>
            )}
        </section>
    )
}

export default Collection
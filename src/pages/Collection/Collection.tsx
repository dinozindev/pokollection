import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { collection, onSnapshot} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import type { CardUser } from "../../types/type";
import { useCards } from "../../hooks/useCards";
import CardDiv from "../../components/CardDiv";

const Collection = () => {

    const { user } = useContext(AuthContext);
    const { addCard, removeCard } = useCards();

    const [userCards, setUserCards] = useState<CardUser[]>([]);
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

    const handleImageLoad = (id: string) => {
        setLoadedImages((prev) => ({
            ...prev,
            [id]: true
        }));
    };

    useEffect(() => {
        if (!user) return;
        const cardsRef = collection(db, "users", user.uid, "cards");

        const unsubscribe = onSnapshot(cardsRef, (snapshot) => {
            const cards: CardUser[] = snapshot.docs.map((doc) => ({
                ...(doc.data() as CardUser),
                id: doc.id
            }));
            setUserCards(cards);
        });

        
        return () => unsubscribe();
    }, [user]);


    return (
        <section className="flex items-center pt-30 flex-col min-h-screen">
            <h2 className="text-4xl font-medium text-amber-800 mt-4">Minha Coleção</h2>
            <div className="flex items-center pb-10 gap-3">
            </div>
            <div className="flex flex-wrap justify-center gap-6">
                {userCards.length !== 0 ? userCards?.map(card => (
                     <CardDiv key={card.id} loadedImages={loadedImages} card={card} handleImageLoad={handleImageLoad} removeCard={removeCard} addCard={addCard} userCards={userCards}/>
                )) : <p>Nenhuma carta em sua coleção ainda!</p>}
            </div>
        </section>
    )
}

export default Collection
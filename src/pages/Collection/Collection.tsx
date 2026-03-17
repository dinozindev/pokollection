import { useContext, useEffect, useState } from "react";
import placeholder from "../../assets/card-placeholder.png";
import { AuthContext } from "../../context/AuthContext";
import { collection, deleteDoc, doc, getDoc, increment, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import type { CardUser } from "../../types/type";
import { useNavigate } from "react-router-dom";

const Collection = () => {

    const { user } = useContext(AuthContext);
    const [userCards, setUserCards] = useState<CardUser[]>([]);
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

    const addCard = async (card: CardUser) => {
        if (!user) return;

        const cardRef = doc(db, "users", user.uid, "cards", card.id);

        await setDoc(
            cardRef,
            {
                id: card.id,
                name: card.name,
                image: card.image ?? "",
                illustrator: card.illustrator ?? "",
                localId: card.localId,
                set: card.set,
                quantity: increment(1)
            },
            { merge: true }
        );
    };


    const removeCard = async (card: CardUser) => {
        if (!user) return;

        const cardRef = doc(db, "users", user.uid, "cards", card.id);

        const snapshot = await getDoc(cardRef);

        if (!snapshot.exists()) return;

        const data = snapshot.data();

        if (data.quantity <= 1) {
            await deleteDoc(cardRef);
        } else {
            await updateDoc(cardRef, {
                quantity: increment(-1)
            });
        }
    };

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
            <div className="flex items-center pb-10 gap-3">
            </div>
            <div className="flex flex-wrap justify-center gap-6">
                {userCards.length !== 0 ? userCards?.map(card => (
                    <div className="w-2/5 flex flex-col gap-1.5 justify-between bg-gray-100 px-2 py-4 rounded-md" key={card.id}>
                        <div className="relative">

                            {!loadedImages[card.id] && (
                                <div className="absolute inset-0 rounded-md overflow-hidden bg-gray-300">
                                    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300"></div>
                                </div>
                            )}

                            <img
                                src={card.image ? `${card.image}/high.png` : placeholder}
                                onLoad={() => handleImageLoad(card.id)}
                                className={`w-full transition-opacity duration-300 ${loadedImages[card.id] ? "opacity-100" : "opacity-0"
                                    }`}
                            />
                        </div>
                        <h3>{card.name}</h3>
                        <p className="text-sm">{card.set.name}</p>
                        <p className="text-sm">{card.localId} / {card.set.cardCount.official}</p>
                        <div className="flex items-center justify-between px-2">
                            <i
                                className="fa-solid fa-minus text-red-500 cursor-pointer"
                                onClick={() => removeCard(card)}
                            ></i>
                            <p className="w-1/2 text-center">
                                {card.quantity}
                            </p>
                            <i
                                className="fa-solid fa-plus text-green-500 cursor-pointer"
                                onClick={() => addCard(card)}
                            ></i>
                        </div>
                    </div>
                )) : <p>Nenhuma carta em sua coleção ainda!</p>}
            </div>
        </section>
    )
}

export default Collection
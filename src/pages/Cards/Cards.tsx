import { useContext, useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar"
import { Query, type Card } from "@tcgdex/sdk";
import { tcgdex } from "../../api/api";
import placeholder from "../../assets/card-placeholder.png";
import Filter from "../../components/Filter";
import { AuthContext } from "../../context/AuthContext";
import { collection, doc, getDocs, increment, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const Cards = () => {

    const { user } = useContext(AuthContext);

    const [cards, setCards] = useState<Card[]>([]);
    const [userCards, setUserCards] = useState<Record<string, number>>({});
    const [search, setSearch] = useState<string>('Pikachu');

    const fetchCards = async () => {
        try {
            const cardsResume = await tcgdex.card.list(
                Query.create()
                    .contains('name', search)
            )
            const cardsList = await Promise.all(
                cardsResume.map(card => tcgdex.card.get(card.id))
            );
            setCards(cardsList);
            console.log(cardsList);
        } catch (error) {
            console.log(error)
        }
    }

    const addCard = async (card: Card) => {
        if (!user) return;

        const cardRef = doc(db, "users", user.uid, "cards", card.id);

        await setDoc(
            cardRef,
            {
                cardId: card.id,
                name: card.name,
                image: card.image ?? "",
                quantity: increment(1)
            },
            { merge: true }
        );
    };


    const removeCard = async (card: Card) => {
        if (!user) return;

        const cardRef = doc(db, "users", user.uid, "cards", card.id);

        await updateDoc(cardRef, {
            quantity: increment(-1)
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        fetchCards();
    };

    useEffect(() => {
        fetchCards();
        if (!user) return;

        const cardsRef = collection(db, "users", user.uid, "cards");

        const unsubscribe = onSnapshot(cardsRef, (snapshot) => {
            const cardsMap: Record<string, number> = {};

            snapshot.forEach((doc) => {
                cardsMap[doc.id] = doc.data().quantity;
            });

            setUserCards(cardsMap);
        });

        return () => unsubscribe();
    }, [user]);

    return (
        <section className="flex items-center pt-30 flex-col">
            <div className="flex items-center pb-10 gap-3">
                <SearchBar
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onSubmit={handleSubmit}
                />
                <Filter />
            </div>
            <div className="flex flex-wrap justify-center gap-6">
                {cards?.map(card => (
                    <div className="w-2/5 flex flex-col gap-1.5 justify-between bg-gray-100 px-2 py-4 rounded-md" key={card.id}>
                        {card.image ? (
                            <img src={`${card.image}/high.png`} />
                        ) : (
                            <img className="w-full" src={placeholder} alt={card.name} />
                        )}
                        <h3>{card.name}</h3>
                        <p className="text-sm">{card.set.name}</p>
                        <p className="text-sm">{card.localId} / {card.set.cardCount.official}</p>
                        <div className="flex items-center justify-between px-2">
                            <i
                                className="fa-solid fa-minus text-red-500 cursor-pointer"
                                onClick={() => removeCard(card)}
                            ></i>
                            <p className="w-1/2 text-center">
                                {userCards[card.id] ?? 0}
                            </p>
                            <i
                                className="fa-solid fa-plus text-green-500 cursor-pointer"
                                onClick={() => addCard(card)}
                            ></i>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Cards
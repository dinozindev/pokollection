import { useContext, useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar"
import { Query, type Card } from "@tcgdex/sdk";
import { tcgdex } from "../../api/api";
import Filter from "../../components/Filter";
import { AuthContext } from "../../context/AuthContext";
import { collection, deleteDoc, doc, getDoc, increment, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useLocation, useNavigate } from "react-router-dom";
import CardDiv from "../../components/CardDiv";

const Cards = () => {

    const { user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const [cards, setCards] = useState<Card[]>([]);
    const [userCards, setUserCards] = useState<Record<string, number>>({});
    const [search, setSearch] = useState<string>('Pikachu');
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
    const [favorites, setFavorites] = useState<Record<string, boolean>>({});
    const [showLoginWindow, setShowLoginWindow] = useState<boolean>(false);

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


    const removeCard = async (card: Card) => {
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

    const toggleFavorite = async (card: Card) => {
        if (!user) return;

        const cardRef = doc(db, "users", user.uid, "favorites", card.id);

        const snapshot = await getDoc(cardRef);

        if (snapshot.exists()) {
            await deleteDoc(cardRef);
            return;
        }

        await setDoc(
            cardRef,
            {
                id: card.id,
                name: card.name,
                image: card.image ?? "",
                illustrator: card.illustrator ?? "",
                localId: card.localId,
                set: card.set
            },
            { merge: true }
        );
    }

    const handleImageLoad = (id: string) => {
        setLoadedImages((prev) => ({
            ...prev,
            [id]: true
        }));
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

    useEffect(() => {
        if (!user) return;

        const favRef = collection(db, "users", user.uid, "favorites");

        const unsubscribe = onSnapshot(favRef, (snapshot) => {
            const favMap: Record<string, boolean> = {};

            snapshot.forEach((doc) => {
                favMap[doc.id] = true;
            });

            setFavorites(favMap);
        });

        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        if (location.state?.loggedIn) {
            setShowLoginWindow(true);

            // limpa o state depois de usar
            navigate(location.pathname, { replace: true });

            setTimeout(() => {
                setShowLoginWindow(false);
            }, 5000);
        }
    }, [location.state]);

    return (
        <section className="flex items-center pt-30 flex-col min-h-screen">
            <div className="flex items-center pb-10 gap-3">
                <SearchBar
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onSubmit={handleSubmit}
                />
                <Filter />
            </div>
            <div className="flex flex-wrap justify-center gap-6">
                {cards.length !== 0 ? cards.map(card => (
                    // Componente de card
                    <CardDiv key={card.id} loadedImages={loadedImages} card={card} handleImageLoad={handleImageLoad} favorites={favorites} toggleFavorite={toggleFavorite} removeCard={removeCard} addCard={addCard} userCards={userCards}/>
                )) : <p>Nenhuma carta encontrada.</p>}
            </div>
            {showLoginWindow && (
                <div className="fixed bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-20">
                    Login realizado com sucesso!
                </div>
            )}
        </section>
    )
}

export default Cards
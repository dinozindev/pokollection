import { useContext, useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar"
import { Query, type Card } from "@tcgdex/sdk";
import { tcgdex } from "../../api/api";
import Filter from "../../components/Filter";
import { AuthContext } from "../../context/AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useLocation, useNavigate } from "react-router-dom";
import CardDiv from "../../components/CardDiv";
import { useCards } from "../../hooks/useCards";
import { useFavorites } from "../../hooks/useFavorites";
import type { CardUser } from "../../types/type";

const Cards = () => {

    const { user } = useContext(AuthContext);
    const { addCard, removeCard } = useCards();
    const { toggleFavorite } = useFavorites();
    const location = useLocation();
    const navigate = useNavigate();

    const [cards, setCards] = useState<Card[]>([]);
    const [userCards, setUserCards] = useState<Record<string, number>>({});
    const [search, setSearch] = useState<string>('');
    const [query, setQuery] = useState<string>('');
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
    const [favorites, setFavorites] = useState<Record<string, boolean>>({});
    const [showLoginWindow, setShowLoginWindow] = useState<boolean>(false);
    const [loginMessage, setLoginMessage] = useState<string>("");

    const fetchCards = async () => {
        try {
            const cardsResume = await tcgdex.card.list(
                Query.create()
                    .contains('name', search)
            )
            const cardsList : any = await Promise.all(
                cardsResume.map(card => tcgdex.card.get(card.id))
            );
            setCards(cardsList);
            console.log(cardsList);
        } catch (error) {
            console.log(error)
        }
    }

    const handleImageLoad = (id: string) => {
        setLoadedImages((prev) => ({
            ...prev,
            [id]: true
        }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setQuery(search);
    };

    const requireAuth = (callback: () => void) => {
    if (!user) {
        setLoginMessage("Você precisa estar logado!");
        setShowLoginWindow(true);

        setTimeout(() => {
            setShowLoginWindow(false);
        }, 3000);

        return;
    }
    callback();
};

    const handleAddCard = (card: CardUser) => {
        requireAuth(() => addCard(card));
    }

    const handleRemoveCard = (card: CardUser) => {
        requireAuth(() => removeCard(card));
    }

    const handleToggleFavorite = (card: Card) => {
        requireAuth(() => toggleFavorite(card))
    }

    useEffect(() => {
        if (!query) return;
        fetchCards();
    }, [query])

    useEffect(() => {
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
            setLoginMessage("Logado com sucesso!");
            setShowLoginWindow(true);

            // limpa o state depois de usar
            navigate(location.pathname, { replace: true });

            setTimeout(() => {
                setShowLoginWindow(false);
            }, 5000);
        }
    }, [location.state]);

    return (
        <section className="flex items-center pt-30 lg:pt-40 flex-col min-h-screen">
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
                    <CardDiv key={card.id} loadedImages={loadedImages} card={card} handleImageLoad={handleImageLoad} favorites={favorites} toggleFavorite={handleToggleFavorite} removeCard={handleRemoveCard} addCard={handleAddCard} userCards={userCards}/>
                )) : <p className="p-2 text-center">Nenhuma carta encontrada. <br></br>
                    Pesquise para encontrar a carta que deseja!</p>}
            </div>
            {showLoginWindow && (
                <div className="fixed bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-20">
                    {loginMessage}
                </div>
            )}
        </section>
    )
}

export default Cards
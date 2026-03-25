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

const Cards = () => {

    const { user } = useContext(AuthContext);
    const { addCard, removeCard } = useCards();
    const { toggleFavorite } = useFavorites();
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
        fetchCards();
    };

    useEffect(() => {
        fetchCards();
    }, [search])

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
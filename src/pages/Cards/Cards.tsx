import { useContext, useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar"
import { Query, type Card } from "@tcgdex/sdk";
import { tcgdex } from "../../api/api";
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
    const [showErrorWindow, setErrorWindow] = useState<boolean>(false);
    const [loginMessage, setLoginMessage] = useState<string>("");
    const [filterScreen, setFilterScreen] = useState<boolean>(false);

    const [selectedSet, setSelectedSet] = useState<string>('');
    const [set, setSet] = useState<string>('');
    const [sets, setSets] = useState<string[]>([]);

    const [showBinderWindow, setShowBinderWindow] = useState<boolean>(false);
    const [binderMessage, setBinderMessage] = useState<string>("");

    // filtro de raridade (TODO)
    // const [rarity, setRarity] = useState<string>('');
    // const rarities = ["Rare Holo", "Common", "Rare", "Uncommon", "Holo Rare", "Special illustration rare"]

    // busca todos os nomes de sets e armazena em um estado
    const fetchSets = async () => {
        try {
            const data = await tcgdex.fetch('sets');

            const uniqueSets = Array.from(
                new Set(data?.map((set: any) => set.name))
            );
            setSets(uniqueSets);
        } catch (error) {
            console.log(error);
        }
    };

    // busca as cartas com base no nome incluido na barra de pesquisa
    const fetchCards = async () => {
        try {
            const cardsResume = await tcgdex.card.list(
                Query.create()
                    .contains('name', search)
            )
            const cardsList: any = await Promise.all(
                cardsResume.map(card => tcgdex.card.get(card.id))
            );
            setCards(cardsList);
            // console.log(cardsList);
        } catch (error) {
            console.log(error)
        }
    }

    // const fetchCardsByRarity = async () => {
    //     try {
    //         const cardsResume = await tcgdex.card.list(
    //             Query.create()
    //                 .contains('rarity', rarity)
    //         )
    //         const cardsList: any = await Promise.all(
    //             cardsResume.map(card => tcgdex.card.get(card.id))
    //         );
    //         setCards(cardsList);
    //         console.log(cardsList);
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const fetchCardsBySet = async () => {
        try {
            const cardsResume = await tcgdex.card.list(
                Query.create()
                    .contains('set.name', set)
            )
            const cardsList: any = await Promise.all(
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
        setSet('')
        setQuery(search);
    };

    const handleSubmitFilter = (e: any) => {
        e.preventDefault();
        setSet(selectedSet);
    }

    // verificação de autenticação para enviar mensagem de erro
    const requireAuth = (callback: () => void) => {
        if (!user) {
            setLoginMessage("Você precisa estar logado para realizar essa ação!");
            setErrorWindow(true);

            setTimeout(() => {
                setErrorWindow(false);
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

    const handleToggleFavorite = (card: CardUser) => {
        requireAuth(() => toggleFavorite(card))
    }

    const handleBinderSuccess = (message: string) => {
        setBinderMessage(message);
        setShowBinderWindow(true);
        setTimeout(() => setShowBinderWindow(false), 5000);
    };

    useEffect(() => {
        fetchSets()
    }, [])

    useEffect(() => {
        if (!query) return;
        fetchCards();
    }, [query])

    // useEffect(() => {
    //     fetchCardsByRarity();
    // }, [rarity]);

    useEffect(() => {
        if (!set) return;
        fetchCardsBySet();
    }, [set])

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
        <section className="flex items-center py-30 lg:pt-40 flex-col min-h-screen">
            <div className="flex items-center pb-10 gap-3">
                <SearchBar
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onSubmit={handleSubmit}
                />
                <i className="fa-solid fa-filter text-amber-800 cursor-pointer hover:text-black transition-all" onClick={() => setFilterScreen(true)}></i>
            </div>
            {set && <p className="text-4xl p-5 mb-10 rounded-xl shadow-xl bg-white">{set}</p>}
            {/* tela de filtros */}
            {filterScreen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Fundo embaçado */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setFilterScreen(false)}
                    ></div>
                    <div className="relative bg-white w-4/5 max-w-md p-4 rounded-2xl shadow-lg z-10">
                        <div className="flex justify-between items-center">
                            <p className="text-xl">Filtrar Cartas</p>
                            <i
                                className="fa-solid fa-xmark text-2xl cursor-pointer"
                                onClick={() => setFilterScreen(false)}
                            ></i>
                        </div>
                        <form onSubmit={handleSubmitFilter} className="flex flex-col gap-3 mt-4" id="form__filter">
                            <label htmlFor="select__set">Set</label>
                            <select
                                name="gens"
                                id="select__set"
                                form="form__filter"
                                onChange={(e) => setSelectedSet(e.target.value)}>
                                <option value="" disabled selected hidden>-- Selecione um set --</option>
                                {sets.map(set => (
                                    <option key={set} value={set}>{set}</option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                className="bg-transparent p-2 mt-4 rounded-2xl border-amber-800 border-2 text-amber-800"
                            >
                                Buscar
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/* <div>
            {rarities.map(rarity => (
                <button onClick={() => setRarity(rarity)}>{rarity}</button>
            ))}
        </div> */}
            <div className="flex flex-wrap justify-center gap-6">
                {cards.length !== 0 ? cards.map(card => (
                    // Componente de card
                    <CardDiv key={card.id} loadedImages={loadedImages} card={card} handleImageLoad={handleImageLoad} favorites={favorites} toggleFavorite={handleToggleFavorite} removeCard={handleRemoveCard} addCard={handleAddCard} userCards={userCards} addToBinder={!!user} onBinderSuccess={handleBinderSuccess}/>
                )) : <p className="p-2 text-center">Nenhuma carta encontrada. <br></br>
                    Pesquise para encontrar a carta que deseja!</p>}
            </div>
            {showLoginWindow && (
                <div className="fixed bg-green-500 text-white px-4 py-4 rounded-lg shadow-lg z-20 transition-all text-xl">
                    {loginMessage}
                </div>
            )}
            {showErrorWindow && (
                <div className="fixed bg-red-500 text-white px-4 py-4 rounded-lg shadow-lg z-20 transition-all text-xl">
                    {loginMessage}
                </div>
            )}
            {showBinderWindow && (
                <div className="fixed bg-white text-black px-4 py-4 rounded-lg shadow-lg z-20 transition-all text-xl">
                    {binderMessage}
                </div>
            )}
        </section>
    )
}

export default Cards
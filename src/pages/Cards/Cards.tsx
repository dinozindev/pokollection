import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar"
import { Query, type Card } from "@tcgdex/sdk";
import { tcgdex } from "../../api/api";
import placeholder from "../../assets/card-placeholder.png";
import Filter from "../../components/Filter";

const Cards = () => {

    const [cards, setCards] = useState<Card[]>([]);
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

    const handleSubmit = (e: any) => {
        e.preventDefault();
        fetchCards();
    };

    useEffect(() => {
        fetchCards();
    }, [])

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
                            <i className="fa-solid fa-minus text-red-500"></i>
                            <p className="w-1/2 text-center">0</p>
                            <i className="fa-solid fa-plus text-green-500"></i>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Cards
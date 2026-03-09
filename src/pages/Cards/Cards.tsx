import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar"
import { Query, type Card, type CardResume } from "@tcgdex/sdk";
import { tcgdex } from "../../api/api";
import placeholder from "../../assets/card-placeholder.png";

const Cards = () => {

    const [cards, setCards] = useState<Card[]>([]);
    const [search, setSearch] = useState<string>('Charizard');

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
        <section className="flex items-center pt-10 flex-col">
            <SearchBar
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onSubmit={handleSubmit}
            />
            <div className="flex flex-wrap justify-center gap-8">
                {cards?.map(card => (
                    <div className="w-2/5 flex flex-col gap-1" key={card.id}>
                        {card.image ? (
                            <img src={`${card.image}/high.png`} />
                        ) : (
                            <img className="w-full" src={placeholder} />
                        )}
                        <h3>{card.name}</h3>
                        <p className="text-sm">{card.set.name}</p>
                        <p className="text-sm">{card.localId} / {card.set.cardCount.official}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Cards
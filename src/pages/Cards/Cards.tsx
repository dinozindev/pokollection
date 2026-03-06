import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar"
import { Query, type Card, type CardResume } from "@tcgdex/sdk";
import { tcgdex } from "../../api/api";
import placeholder from "../../assets/card-placeholder.png";

const Cards = () => {

    const [cards, setCards] = useState<Card[]>([]);
    const [search, setSearch] = useState<string>('Pikachu');

    const fetchCards = async () => {
        try {
            const cardsResume = await tcgdex.card.list(
                Query.create()
                    .equal('name', search)
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

    useEffect(() => {
        fetchCards();
    }, [])

    return (
        <section className="flex items-center pt-10 flex-col">
            <SearchBar />
            <div className="flex flex-wrap justify-center gap-8">
                {cards?.map(card => (
                    <div className="w-2/5" key={card.id}>
                        {card.image ? (
                            <img src={`${card.image}/high.png`} />
                        ) : (
                            <img className="w-full" src={placeholder} />
                        ) }
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Cards
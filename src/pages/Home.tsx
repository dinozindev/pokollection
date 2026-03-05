import { useEffect, useState } from "react";
import { tcgdex } from "../api/api";
import type { Card } from "@tcgdex/sdk";

const Home = () => {
  
  const [card, setCard] = useState<Card | null>(null);

  const fetchCard = async () => {
    try {
      const card = await tcgdex.card.get('swsh3-136');
      setCard(card);
      console.log(card)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchCard()
  }, [])

  return (
    <>
    <img src={`${card?.image}/high.png`} />
    </>
  )
}

export default Home
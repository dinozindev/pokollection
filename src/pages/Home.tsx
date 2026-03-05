import { useEffect, useState } from "react";
import client from "../api/api";
import type { Set } from "../types/type";

type CardImages = {
  small: string;
  large: string;
}

type CardResponse = {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  level?: string;
  hp: string;
  types: string[];
  set: Set;
  number: string;
  artist: string;
  rarity: string;
  nationalPokedexNumbers: number[];
  images: CardImages;
}

const Home = () => {

  const [card, setCard] = useState<CardResponse>();

  const fetchCard = async () => {
    try {
      const response = await client.get<{ data: CardResponse }>("/cards/xy1-1");
      setCard(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCard();
  }, [])

  return (
    <>
      <p>{card?.id}</p>
      <img src={card?.images.large} />
    </>
  )
}

export default Home
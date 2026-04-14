import { useEffect, useState } from "react";
import CarrosselCards from "../../components/CarrosselCards"
import { tcgdex } from "../../api/api";
import { Query, type Card } from "@tcgdex/sdk";
import { Link } from "react-router-dom";
import HomeCard from "../../components/HomeCard";

const Home = () => {

  const [cards, setCards] = useState<Card[]>([]);

  // busca as cartas com base no nome incluido na barra de pesquisa
  const fetchCardsBySet = async () => {
    try {
      const cardsResume = await tcgdex.card.list(
        Query.create()
          .contains('set.name', "Ascended Heroes")
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

  useEffect(() => {
    fetchCardsBySet();
  }, [])

  return (
    <>
      <section className="py-40">
        <div className="w-full pt-10 md:pt-30 pb-30 flex flex-col md:flex-row justify-center items-center px-10 lg:px-40 gap-10">
          <div className="flex flex-col md:w-1/2 gap-6 w-full">
            <h2 className="text-4xl lg:text-5xl">Encontre suas <br />cartas <span className="text-amber-800">Pokémon favoritas!</span></h2>
            <Link to="/cards" className="border-solid rounded-md border px-3 py-2 text-amber-800 hover:text-black cursor-pointer transition-all w-30 text-center">Explore</Link>
          </div>
          <p className="md:w-1/2 w-full text-xl">No <span className="text-amber-800">Pokollection</span>, você cataloga sua coleção real, organiza suas cartas em pastas e destaca suas cartas favoritas. Cadastre-se agora e transforme sua paixão por Pokémon em uma <span className="text-amber-800">galeria organizada e profissional</span>.</p>
        </div>
        <div className="pb-40">
          <CarrosselCards cartas={cards} />
        </div>
        <div className="flex flex-col md:flex-row py-20 px-10 lg:px-30 gap-6 w-full">
          <HomeCard title="Adicione cartas a sua coleção!" description="Adicione suas cartas físicas e digitais em segundos. Seu catálogo pessoal, disponível onde quer que você esteja.">
            <i className="fa-solid fa-layer-group text-6xl lg:text-8xl text-amber-800"></i>
          </HomeCard>
          <HomeCard title="Favorite suas cartas mais queridas!" description="Guarde aquelas artes épicas no topo! Marque suas favoritas para encontrar rápido e compartilhar com os seus amigos.">
            <i className="fa-solid fa-star text-6xl lg:text-8xl text-amber-800"></i>
          </HomeCard>
          <HomeCard title="Crie Binders/Pastas para separar suas cartas!" description="Monte seus Binders do seu jeito! Separe seus decks de jogo das cartas de coleção de forma simples e intuitiva.">
            <i className="fa-solid fa-folder text-6xl lg:text-8xl text-amber-800"></i>
          </HomeCard>
        </div>
      </section>
    </>
  )
}

export default Home
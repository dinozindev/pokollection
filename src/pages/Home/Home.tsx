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
        <div className="w-full pt-10 md:pt-30 pb-30 flex flex-col lg:flex-row justify-center items-center px-10 lg:px-40 gap-10">
          <div className="flex flex-col md:w-1/2 gap-6 w-full">
            <h2 className="text-4xl lg:text-5xl">Encontre suas <br />cartas <span className="text-amber-800">Pokémon favoritas!</span></h2>
            <Link to="/cards" className="border-solid rounded-md border px-3 py-2 text-amber-800 hover:text-black cursor-pointer transition-all w-30 text-center">Explore</Link>
          </div>
          <p className="md:w-1/2 w-full">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Adipisci dolorem deleniti animi placeat sapiente optio, nemo, quas, deserunt laudantium provident velit consequatur facere commodi dolore eum quae. Atque, repellendus vero.</p>
        </div>
        <div className="pb-40">
          <CarrosselCards cartas={cards} />
        </div>
        <div className="flex flex-col md:flex-row pt-20 px-10 lg:px-30 gap-4 w-full">
          <HomeCard title="Adicione cartas a sua coleção!" description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius modi accusamus illo tenetur blanditiis voluptatem nemo, temporibus reiciendis? Nostrum harum cupiditate eaque pariatur veritatis assumenda saepe eligendi vitae laudantium praesentium?">
            <i className="fa-solid fa-layer-group text-6xl lg:text-8xl text-amber-800"></i>
          </HomeCard>
          <HomeCard title="Favorite suas cartas mais queridas!" description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius modi accusamus illo tenetur blanditiis voluptatem nemo, temporibus reiciendis? Nostrum harum cupiditate eaque pariatur veritatis assumenda saepe eligendi vitae laudantium praesentium?">
            <i className="fa-solid fa-star text-6xl lg:text-8xl text-yellow-500"></i>
          </HomeCard>
          <HomeCard title="Crie Binders/Pastas para separar suas cartas!" description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius modi accusamus illo tenetur blanditiis voluptatem nemo, temporibus reiciendis? Nostrum harum cupiditate eaque pariatur veritatis assumenda saepe eligendi vitae laudantium praesentium?">
            <i className="fa-solid fa-folder text-6xl lg:text-8xl"></i>
          </HomeCard>
        </div>
      </section>
    </>
  )
}

export default Home
import { useEffect, useState } from "react";
import CarrosselCards from "../../components/CarrosselCards"
import { tcgdex } from "../../api/api";
import { Query, type Card } from "@tcgdex/sdk";
import { Link } from "react-router-dom";

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
      <section className="pt-40">
        <div className="w-full pt-40 pb-30 flex justify-center items-center px-40 gap-10">
          <div className="flex flex-col w-1/2 gap-6">
            <h2 className="text-6xl">Encontre suas <br />cartas <span className="text-amber-800">Pokémon favoritas!</span></h2>
            <Link to="/cards" className="border-solid rounded-md border px-3 py-2 text-amber-800 hover:text-black cursor-pointer transition-all w-30 text-center">Explore</Link>
          </div>
          <p className="w-1/2">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Adipisci dolorem deleniti animi placeat sapiente optio, nemo, quas, deserunt laudantium provident velit consequatur facere commodi dolore eum quae. Atque, repellendus vero.</p>
        </div>
        <div className="pb-40">
          <CarrosselCards cartas={cards} />
        </div>
        <div className="h-screen flex pt-20 px-30 items-center gap-4">
          <div className="bg-white p-4 flex flex-col items-center shadow-2xl">
            <i className="fa-solid fa-layer-group text-6xl text-amber-800"></i>
            <h3 className="text-2xl font-medium">Adicione cartas a sua coleção!</h3>
            <p className="text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius modi accusamus illo tenetur blanditiis voluptatem nemo, temporibus reiciendis? Nostrum harum cupiditate eaque pariatur veritatis assumenda saepe eligendi vitae laudantium praesentium?</p>
          </div>
          <div className="bg-white p-4 shadow-2xl flex flex-col items-center">
            <i className="fa-solid fa-star text-6xl text-yellow-500"></i>
            <h3 className="text-2xl font-medium">Favorite suas cartas mais queridas!</h3>
            <p className="text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius modi accusamus illo tenetur blanditiis voluptatem nemo, temporibus reiciendis? Nostrum harum cupiditate eaque pariatur veritatis assumenda saepe eligendi vitae laudantium praesentium?</p>
          </div>
          <div className="bg-white p-4 shadow-2xl flex flex-col items-center">
            <i className="fa-solid fa-folder text-6xl"></i>
            <h3 className="text-2xl font-medium">Crie Binders/Pastas para separar suas cartas!</h3>
            <p className="text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius modi accusamus illo tenetur blanditiis voluptatem nemo, temporibus reiciendis? Nostrum harum cupiditate eaque pariatur veritatis assumenda saepe eligendi vitae laudantium praesentium?</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
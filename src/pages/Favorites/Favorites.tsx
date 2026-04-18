import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import type { CardUser } from "../../types/type";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useFavorites } from "../../hooks/useFavorites";
import CardDiv from "../../components/CardDiv";

const Favorites = () => {

  const { user } = useContext(AuthContext);
  const { toggleFavoriteUser } = useFavorites();

  const [userFavoriteCards, setUserFavoriteCards] = useState<CardUser[]>([]);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});


  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [id]: true
    }));
  }

  // obtém todas as cartas favoritas do usuário e armazena no estado userFavoriteCards
  useEffect(() => {
    if (!user) return;

    const favRef = collection(db, "users", user.uid, "favorites");

    const unsubscribe = onSnapshot(favRef, (snapshot) => {
      const cards: CardUser[] = [];
      const favMap: Record<string, boolean> = {};

      snapshot.forEach((doc) => {
        const data = doc.data() as CardUser;

        cards.push({
          ...data,
          id: doc.id
        });

        favMap[doc.id] = true;
      });

      setUserFavoriteCards(cards);
      setFavorites(favMap);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <section className="flex items-center py-30 flex-col min-h-screen">
      <h2 className="text-4xl font-medium text-amber-800 mt-4 bg-white p-4 rounded-xl shadow-xl">Meus Favoritos</h2>
      <div className="flex items-center pb-10 gap-3">
      </div>
      <div className={`flex flex-wrap justify-center gap-6 ${userFavoriteCards.length === 1 ? "w-full" : ""}`}>
        {userFavoriteCards.length !== 0 ? userFavoriteCards.map(card => (
          <CardDiv key={card.id} loadedImages={loadedImages} card={card} handleImageLoad={handleImageLoad} favorites={favorites} toggleFavorite={toggleFavoriteUser} />
        )) : <p>Nenhuma carta em seus favoritos ainda!</p>}
      </div>
    </section>
  )
}

export default Favorites
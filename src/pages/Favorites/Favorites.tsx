import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import type { CardUser } from "../../types/type";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useFavorites } from "../../hooks/useFavorites";
import CardDiv from "../../components/CardDiv";
import { useParams } from "react-router-dom";

const Favorites = () => {

  const { id } = useParams();
  const { user } = useContext(AuthContext);
  if (!user) return;
  const { toggleFavoriteUser } = useFavorites();
  const [userFavoriteCards, setUserFavoriteCards] = useState<CardUser[]>([]);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const targetUid = id || user.uid;
  const isOwnProfile = !id;


  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [id]: true
    }));
  }

  // obtém todas as cartas favoritas do usuário e armazena no estado userFavoriteCards
  useEffect(() => {
    if (!user) return;

    const favRef = collection(db, "users", targetUid, "favorites");

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

      cards.sort((a, b) => {
        const aTime = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : 0;
        const bTime = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : 0;
        return bTime - aTime;
      });

      setUserFavoriteCards(cards);
      setFavorites(favMap);
    });

    return () => unsubscribe();
  }, [targetUid]);

  return (
    <section className="flex items-center py-30 flex-col min-h-screen">
      <h2 className="text-4xl font-medium text-amber-800 mt-4 bg-white p-4 rounded-xl shadow-xl">{isOwnProfile ? "Meus Favoritos" : "Favoritos"}</h2>
      <div className="flex items-center pb-10 gap-3">
      </div>
      <div className={`flex flex-wrap justify-center gap-6 ${userFavoriteCards.length <= 2 ? "w-full" : ""}`}>
        {userFavoriteCards.length !== 0 ? userFavoriteCards.map(card => (
          isOwnProfile
            ?
            <CardDiv key={card.id} loadedImages={loadedImages} card={card} handleImageLoad={handleImageLoad} favorites={favorites} toggleFavorite={toggleFavoriteUser} />
            :
            <CardDiv key={card.id} loadedImages={loadedImages} card={card} handleImageLoad={handleImageLoad} favorites={favorites} />
        )) : <p>{isOwnProfile ? "Nenhuma carta em seus favoritos ainda!" : "Nenhuma carta adicionada aos favoritos!"}</p>}
      </div>
    </section>
  )
}

export default Favorites
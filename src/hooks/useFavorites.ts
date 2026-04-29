import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { CardUser } from "../types/type";

export const useFavorites = () => {
    const { user } = useContext(AuthContext);

    const toggleFavorite = async (card: CardUser) => {
        if (!user) return;

        const cardRef = doc(db, "users", user.uid, "favorites", card.id);

        const snapshot = await getDoc(cardRef);

        if (snapshot.exists()) {
            await deleteDoc(cardRef);
            return;
        }

        await setDoc(
            cardRef,
            {
                id: card.id,
                name: card.name,
                image: card.image ?? "",
                illustrator: card.illustrator ?? "",
                localId: card.localId,
                set: card.set,
                createdAt: serverTimestamp(),
                rarity: card.rarity
            },
            { merge: true }
        );
    }

    // obtém as cartas favoritas do usuário, e caso esteja nela, quando clicado para favoritar, desfavorita e vice-versa
      const toggleFavoriteUser = async (card: CardUser) => {
        if (!user) return;
    
        const cardRef = doc(db, "users", user.uid, "favorites", card.id);
    
        const snapshot = await getDoc(cardRef);
    
        if (snapshot.exists()) {
          await deleteDoc(cardRef);
          return;
        }
    
        await setDoc(
          cardRef,
          {
            id: card.id,
            name: card.name,
            image: card.image ?? "",
            illustrator: card.illustrator ?? "",
            localId: card.localId,
            set: card.set
          },
          { merge: true }
        );
      }
    

    return { toggleFavorite, toggleFavoriteUser }
}
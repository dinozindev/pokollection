import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"
import type { CardUser } from "../types/type";
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

// se usuario possui carta, nao pode adicionar a wishlist
// se usuario nao possui carta, adicionar a wishlist
// se usuario tem carta na wishlist e adiciona a coleção, remover da wishlist

export const useWishlist = () => {
    const { user } = useContext(AuthContext);

    const toggleWishlist = async (card: CardUser) : Promise<{type: 'error' | 'success' | 'removed', message: string} | undefined>  => {
        if (!user) return;

        const colecaoRef = doc(db, "users", user.uid, "cards", card.id);
        const colecaoSnapshot = await getDoc(colecaoRef);

        if(colecaoSnapshot.exists()) return { type: 'error', message: `${card.name} já está presente em sua coleção!` };

        const cardRef = doc(db, "users", user.uid, "wishlist", card.id);

        const snapshot = await getDoc(cardRef);

        if (snapshot.exists()) {
            await deleteDoc(cardRef);
            return { type: 'removed', message: `${card.name} removido da Wishlist!` };
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

        return { type: 'success', message: `${card.name} adicionado à Wishlist!` };
    };

    // utilizado pela função do hook useCards para remover caso a carta seja adicionada a coleção
    const removeFromWishlist = async (card: CardUser) => {

        if (!user) return;

        const cardRef = doc(db, "users", user.uid, "wishlist", card.id);

        await deleteDoc(cardRef);
    }

    return { toggleWishlist, removeFromWishlist }
}
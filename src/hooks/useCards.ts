import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import type { CardUser } from "../types/type";
import { collection, deleteDoc, doc, getDoc, getDocs, increment, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const useCards = () => {
    const { user } = useContext(AuthContext);

    const addCard = async (card: CardUser) => {
        if (!user) return;

        const cardRef = doc(db, "users", user.uid, "cards", card.id);

        await setDoc(
            cardRef,
            {
                id: card.id,
                name: card.name,
                image: card.image ?? "",
                illustrator: card.illustrator ?? "",
                localId: card.localId,
                set: card.set,
                quantity: increment(1),
                createdAt: serverTimestamp(),
                rarity: card.rarity
            },
            { merge: true }
        );
    };

    const removeCard = async (card: CardUser) => {
        if (!user) return;

        const cardRef = doc(db, "users", user.uid, "cards", card.id);
        const snapshot = await getDoc(cardRef);

        if (!snapshot.exists()) return;

        const data = snapshot.data();

        if (data.quantity <= 1) {
            await deleteDoc(cardRef);

            // remove de todos os binders também
            const bindersRef = collection(db, "users", user.uid, "binders");
            const bindersSnap = await getDocs(bindersRef);

            await Promise.all(
                bindersSnap.docs.map(async (binderDoc) => {
                    const cartaRef = doc(db, "users", user.uid, "binders", binderDoc.id, "cartas", card.id);
                    const cartaSnap = await getDoc(cartaRef);
                    if (cartaSnap.exists()) await deleteDoc(cartaRef);
                })
            );
        } else {
            await updateDoc(cardRef, { quantity: increment(-1) });
        }
    };
    return { addCard, removeCard }
}


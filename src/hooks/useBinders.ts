import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { CardUser, Binder } from "../types/type";

export const useBinders = () => {
    const { user } = useContext(AuthContext);

    const fetchBinders = async (): Promise<Binder[]> => {
        if (!user) return [];

        const ref = collection(db, "users", user.uid, "binders");
        const snap = await getDocs(ref);
        return snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as { nome: string }) }));
    };

    const criarBinder = async (nome: string) => {
        if (!user) return;

        const bindersRef = collection(db, "users", user.uid, "binders");

        const docRef = await addDoc(bindersRef, {
            nome,
            criadoEm: serverTimestamp()
        });

        return docRef; // adiciona o return
    };

    const deletarBinder = async (binderId: string) => {
        if (!user) return;

        const binderRef = doc(db, "users", user.uid, "binders", binderId);

        await deleteDoc(binderRef);
    };

    const adicionarCartaNaBinder = async (binderId: string, card: CardUser) => {
        if (!user) return;

        const cartaRef = doc(db, "users", user.uid, "binders", binderId, "cartas", card.id);

        await setDoc(
            cartaRef,
            {
                id: card.id,
                name: card.name,
                image: card.image ?? "",
                illustrator: card.illustrator ?? "",
                localId: card.localId,
                set: card.set,
                rarity: card.rarity
            },
            { merge: true }
        );
    };

    const removerCartaDaBinder = async (binderId: string, cardId: string) => {
        if (!user) return;

        const cartaRef = doc(db, "users", user.uid, "binders", binderId, "cartas", cardId);

        const snapshot = await getDoc(cartaRef);

        if (!snapshot.exists()) return;

        await deleteDoc(cartaRef);
    };

    return { fetchBinders, criarBinder, deletarBinder, adicionarCartaNaBinder, removerCartaDaBinder };
};
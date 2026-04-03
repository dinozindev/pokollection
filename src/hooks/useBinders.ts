import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { CardUser, Binder, BinderWithCards } from "../types/type";
import { useCards } from "./useCards";

export const useBinders = () => {
    const { user } = useContext(AuthContext);

    const { addCard, removeCard } = useCards();

    const fetchBinders = async (): Promise<Binder[]> => {
        if (!user) return [];

        const ref = collection(db, "users", user.uid, "binders");
        const snap = await getDocs(ref);
        return snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as { nome: string }) }));
    };

    const fetchBinderWithCards = async (binderId: string): Promise<BinderWithCards | null> => {
        if (!user) return null;

        const binderRef = doc(db, "users", user.uid, "binders", binderId);
        const cartasRef = collection(db, "users", user.uid, "binders", binderId, "cartas");

        const [binderSnap, cartasSnap] = await Promise.all([
            getDoc(binderRef),
            getDocs(cartasRef)
        ]);

        if (!binderSnap.exists()) return null;

        const cartas = cartasSnap.docs.map(doc => doc.data() as CardUser);

        return {
            id: binderSnap.id,
            ...(binderSnap.data() as Omit<Binder, 'id'>),
            cartas
        };
    };

    const fetchAllBindersWithCards = async (): Promise<BinderWithCards[]> => {
        if (!user) return [];

        const bindersRef = collection(db, "users", user.uid, "binders");
        const bindersSnap = await getDocs(bindersRef);

        const binders = await Promise.all(
            bindersSnap.docs.map(async (binderDoc) => {
                const cartasRef = collection(db, "users", user.uid, "binders", binderDoc.id, "cartas");
                const cartasSnap = await getDocs(cartasRef);

                const cartas = cartasSnap.docs.map(doc => doc.data() as CardUser);

                return {
                    id: binderDoc.id,
                    ...(binderDoc.data() as Omit<Binder, 'id'>),
                    cartas
                };
            })
        );

        return binders;
    };

    const criarBinder = async (nome: string) => {
        if (!user) return;

        const bindersRef = collection(db, "users", user.uid, "binders");

        const docRef = await addDoc(bindersRef, {
            nome,
            criadoEm: serverTimestamp()
        });

        return docRef; 
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

        addCard(card);
    };

    const removerCartaDaBinder = async (binderId: string, card: CardUser) => {
        if (!user) return;

        const cartaRef = doc(db, "users", user.uid, "binders", binderId, "cartas", card.id);

        const snapshot = await getDoc(cartaRef);

        if (!snapshot.exists()) return;

        await deleteDoc(cartaRef);

        removeCard(card);
    };

    return { fetchBinders, fetchBinderWithCards, fetchAllBindersWithCards, criarBinder, deletarBinder, adicionarCartaNaBinder, removerCartaDaBinder };
};
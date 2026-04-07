import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useBinders } from "../../hooks/useBinders";
import { AuthContext } from "../../context/AuthContext";
import type { Binder, BinderWithCards, CardUser } from "../../types/type";
import CardDiv from "../../components/CardDiv";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const BinderDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const { removeCardFromBinder } = useBinders();
    const [binder, setBinder] = useState<BinderWithCards | null>(null);
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

    const handleImageLoad = (id: string) => {
        setLoadedImages((prev) => ({
            ...prev,
            [id]: true
        }));
    };

    useEffect(() => {
        if (!user || !id) return;

        const binderRef = doc(db, "users", user.uid, "binders", id);
        const cartasRef = collection(db, "users", user.uid, "binders", id, "cartas");

        const unsubscribeBinder = onSnapshot(binderRef, (binderSnap) => {
            if (!binderSnap.exists()) return;

            const binderData = binderSnap.data() as Omit<Binder, 'id'>;

            const unsubscribeCartas = onSnapshot(cartasRef, (cartasSnap) => {
                const cartas = cartasSnap.docs.map(doc => doc.data() as CardUser);

                setBinder({
                    id: binderSnap.id,
                    ...binderData,
                    cartas
                });
            });

            return () => unsubscribeCartas();
        });

        return () => unsubscribeBinder();
    }, [user, id]);

    if (!binder) return <p>Carregando...</p>;

    return (
        <section className="flex items-center py-30 flex-col min-h-screen">
            <div className="flex items-center gap-8 mt-4">
                <Link to="/binders">
                    <i className="fa-solid fa-chevron-left bg-white pr-10 pl-6 py-6 text-2xl text-center rounded-2xl hover:bg-amber-800 hover:text-white transition-all cursor-pointer"></i>
                </Link>
                <h2 className="text-4xl font-medium text-amber-800 bg-white p-4 rounded-xl shadow-xl">{binder.nome}</h2>
            </div>
            <div className="flex items-center pb-10 gap-3">
            </div>
            <div className={`flex flex-wrap justify-center gap-6 ${binder.cartas.length === 1 ? "w-full" : ""}`}>
                {binder.cartas.length !== 0 ? binder.cartas.map(card => (
                    <CardDiv key={card.id} loadedImages={loadedImages} card={card} handleImageLoad={handleImageLoad} removeFromBinder={removeCardFromBinder} binderId={binder.id} userCards={binder.cartas} />
                )) : <p>Nenhuma carta em seu binder ainda!</p>}
            </div>
        </section>
    )
}

export default BinderDetails
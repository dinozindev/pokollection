import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useBinders } from "../../hooks/useBinders";
import { AuthContext } from "../../context/AuthContext";
import type { Binder, BinderWithCards, CardUser } from "../../types/type";
import CardDiv from "../../components/CardDiv";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const BinderDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const { removeCardFromBinder, removeBinder } = useBinders();
    const [binder, setBinder] = useState<BinderWithCards | null>(null);
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
    const [binderDelete, setBinderDelete] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleImageLoad = (id: string) => {
        setLoadedImages((prev) => ({
            ...prev,
            [id]: true
        }));
    };

    const handleBinderDelete = () => {
        removeBinder(binder.id);
        navigate("/binders");
    }

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
            {binderDelete && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Fundo embaçado */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setBinderDelete(false)}
                    ></div>
                    {/* Pop-up de edição */}
                    <div className="relative bg-white w-4/5 max-w-md p-8 rounded-2xl shadow-lg z-10 text-center flex flex-col items-center gap-4">
                        <p>Deseja realmente remover o binder?<br></br>Essa ação não pode ser revertida.</p>
                        <div className="flex items-center gap-4">
                            <div className="bg-green-300 py-2 px-6 rounded-xl hover:bg-green-500 transition-all cursor-pointer" onClick={handleBinderDelete}>
                                Sim
                            </div>
                            <div className="bg-red-300 py-2 px-6 rounded-xl hover:bg-red-500 transition-all cursor-pointer" onClick={() => setBinderDelete(false)}>
                                Não
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex items-center justify-start gap-8 mt-4">
                <Link to="/binders">
                    <i className="fa-solid fa-chevron-left bg-white pr-10 pl-6 py-6 text-2xl text-center rounded-2xl hover:bg-amber-800 hover:text-white transition-all cursor-pointer"></i>
                </Link>
                <h2 className="text-4xl font-medium text-amber-800 bg-white p-4 rounded-xl shadow-xl">{binder.nome}</h2>
                    <i className="fa-solid fa-trash-can bg-white pr-10 pl-5 py-6 text-2xl text-center rounded-2xl hover:bg-amber-800 hover:text-white transition-all cursor-pointer" onClick={() => setBinderDelete(true)}></i>
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
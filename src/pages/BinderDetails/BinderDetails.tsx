import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useBinders } from "../../hooks/useBinders";
import { AuthContext } from "../../context/AuthContext";
import type { Binder, BinderWithCards, CardUser } from "../../types/type";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import placeholder from "../../assets/card-placeholder.png";

const BinderDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const { removeCardFromBinder, removeBinder } = useBinders();
    const [binder, setBinder] = useState<BinderWithCards>();
    const [binderDelete, setBinderDelete] = useState<boolean>(false);
    const navigate = useNavigate();
    // estado da página atual
    const [currentPage, setCurrentPage] = useState(0);
    // quantidade de cartas por página
    const cardsPerPage = 9;
    // Calcula quais cartas mostrar na página atual
    const startIndex = currentPage * cardsPerPage;
    // define as cartas visíveis na página atual
    const visibleCards = binder?.cartas?.slice(startIndex, startIndex + cardsPerPage) || [];
    // Calcula quantos espaços vazios faltam para completar a grade de 9
    const emptySlots = Math.max(0, cardsPerPage - visibleCards.length);
    // Total de páginas
    const totalPages = Math.ceil((binder?.cartas?.length || 0) / cardsPerPage);

    // controla a remoção do binder
    const handleBinderDelete = () => {
        if (!binder) return;

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
                    {/* Pop-up de remoção */}
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
            <div className="group bg-slate-50 p-5 w-full sm:w-1/2 lg:w-4/10 flex flex-col items-center gap-6 rounded-2xl border border-slate-200">
                {/* Grid de Cartas */}
                <div className="grid grid-cols-3 gap-2 bg-slate-200 p-2 rounded-lg shadow-inner w-full">
                    {visibleCards.map((carta, index) => (

                        <div key={index} className="relative w-full aspect-7/10 overflow-hidden rounded-md shadow-sm bg-white">
                            <img
                                className="w-full h-full object-cover"
                                src={carta.image ? `${carta.image}/high.png` : placeholder}
                                alt="Pokémon Card"
                            />
                            <div className="absolute top-1 right-1 z-10 bg-white/70 rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                                <i
                                    className="fa-solid fa-xmark text-amber-800 hover:text-black transition-all cursor-pointer"
                                    onClick={() => removeCardFromBinder(binder.id, carta)}
                                ></i>
                            </div>
                        </div>

                    ))}

                    {/* Espaços Vazios (Placeholders) */}
                    {Array.from({ length: emptySlots }).map((_, i) => (
                        <div
                            key={`empty-${i}`}
                            className="w-full aspect-7/10 bg-slate-300/50 border-2 border-dashed border-slate-400/30 rounded-md"
                        ></div>
                    ))}
                </div>

                {/* Controles de Paginação */}
                <div className="flex items-center gap-6 mt-2">
                    <button
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="disabled:opacity-30 disabled:cursor-not-allowed hover:text-amber-800 transition-colors cursor-pointer"
                    >
                        <i className="fa-solid fa-circle-chevron-left text-3xl"></i>
                    </button>

                    <span className="font-bold text-slate-600">
                        Página {currentPage + 1} de {Math.max(1, totalPages)}
                    </span>

                    <button
                        disabled={currentPage >= totalPages - 1}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="disabled:opacity-30 disabled:cursor-not-allowed hover:text-amber-800 transition-colors cursor-pointer"
                    >
                        <i className="fa-solid fa-circle-chevron-right text-3xl"></i>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default BinderDetails
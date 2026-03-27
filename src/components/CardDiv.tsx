import { useState } from "react";
import placeholder from "../assets/card-placeholder.png"

type CardProps = {
    loadedImages: Record<string, boolean>;
    card: any;
    handleImageLoad: (id: string) => void;
    favorites?: Record<string, boolean>;
    toggleFavorite?: any;
    removeCard?: any;
    addCard?: any;
    userCards?: any;
}

const CardDiv = ({ loadedImages, card, handleImageLoad, favorites, toggleFavorite, removeCard, addCard, userCards }: CardProps) => {

    const [cardPreview, setCardPreview] = useState<boolean>();

    return (
        <div className="w-2/5 flex flex-col gap-1.5 justify-between shadow-xl bg-gray-100 px-2 py-4 rounded-md" key={card.id}>
            {cardPreview && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Fundo embaçado */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setCardPreview(false)}
                    ></div>
                    {/* Pop-up da carta individual */}
                    <div className="relative bg-white w-9/10 max-w-md p-4 rounded-2xl shadow-lg z-10 flex flex-col gap-4">
                        <div className="flex justify-between items-center ">
                            <div className="flex items-center gap-2">
                                <p className="text-xl">{card.name} - ({card.localId} / {card.set.cardCount.official})</p>
                            </div>
                            <i
                                className="fa-solid fa-xmark text-2xl cursor-pointer"
                                onClick={() => setCardPreview(false)}
                            ></i>
                        </div>
                        <img src={card.image ? `${card.image}/high.png` : placeholder} />
                        <div className="flex items-center justify-center gap-2 shadow-xl border-gray-300 border py-4">
                            <p className="text-lg">{card.set.name}</p>
                            {card.set.symbol && <img className="w-1/10" src={`${card.set.symbol}.png`} />}
                        </div>
                        <p className="shadow-xl border-gray-300 border py-4 text-center text-lg">{card.illustrator}</p>
                        {userCards &&
                            <div className="flex items-center justify-evenly px-2">
                                <i
                                    className="fa-solid fa-minus text-red-500 cursor-pointer"
                                    onClick={() => removeCard(card)}
                                ></i>
                                <p className="w-1/2 text-center">
                                    {card.quantity ?? userCards?.[card.id] ?? 0}
                                </p>
                                <i
                                    className="fa-solid fa-plus text-green-500 cursor-pointer"
                                    onClick={() => addCard(card)}
                                ></i>
                            </div>}
                    </div>
                </div>
            )}
            <div className="relative">
                {!loadedImages[card.id] && (
                    <div className="absolute inset-0 rounded-md overflow-hidden bg-gray-300">
                        <div className="absolute inset-0 animate-pulse bg-linear-to-r from-gray-300 via-gray-400 to-gray-300"></div>
                    </div>
                )}
                <img
                    src={card.image ? `${card.image}/high.png` : placeholder}
                    onLoad={() => handleImageLoad(card.id)}
                    className={`w-full transition-opacity duration-300 ${loadedImages[card.id] ? "opacity-100" : "opacity-0"
                        }`}
                />
            </div>
            <div className="flex items-center justify-between">
                <h3>{card.name}</h3>
                <i className="fa-solid fa-circle-info text-amber-800 hover:text-black transition-all" onClick={() => setCardPreview(true)}></i>
            </div>
            <p className="text-sm">{card.set.name}</p>
            <div className="flex gap-1 items-center">
                <p className="text-sm">{card.localId} / {card.set.cardCount.official}</p>
                {favorites && <i
                    className={`cursor-pointer transition-all ${favorites[card.id]
                        ? "fa-solid fa-star text-yellow-400"
                        : "fa-regular fa-star text-gray-400"
                        }`}
                    onClick={() => toggleFavorite(card)}
                ></i>}
            </div>
            {userCards &&
                <div className="flex items-center justify-between px-2">
                    <i
                        className="fa-solid fa-minus text-red-500 cursor-pointer"
                        onClick={() => removeCard(card)}
                    ></i>
                    <p className="w-1/2 text-center">
                        {card.quantity ?? userCards?.[card.id] ?? 0}
                    </p>
                    <i
                        className="fa-solid fa-plus text-green-500 cursor-pointer"
                        onClick={() => addCard(card)}
                    ></i>
                </div>}

        </div>
    )
}

export default CardDiv
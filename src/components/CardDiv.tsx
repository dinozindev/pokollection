import { useState } from "react";
import placeholder from "../assets/card-placeholder.png"
import BinderMenu from "./BinderMenu";
import type { CardUser } from "../types/type";

type CardProps = {
    loadedImages: Record<string, boolean>;
    card: CardUser | any;
    handleImageLoad: (id: string) => void;
    favorites?: Record<string, boolean>;
    wishlist?: Record<string, boolean>;
    toggleFavorite?: (card: CardUser) => void;
    toggleWishlist?: (card: CardUser) => void;
    removeCard?: (card: CardUser) => void;
    addCard?: (card: CardUser) => void;
    userCards?: any;
    addToBinder?: boolean;
    onBinderSuccess?: (message: string) => void;
}

const CardDiv = ({ loadedImages, card, handleImageLoad, favorites, wishlist, toggleFavorite, toggleWishlist, removeCard, addCard, userCards, addToBinder, onBinderSuccess }: CardProps) => {

    const [cardPreview, setCardPreview] = useState<boolean>();
    const [binderMenu, setBinderMenu] = useState<boolean>(false);

    return (
        <div className="w-5/12 lg:w-1/6 flex flex-col gap-1.5 justify-between shadow-xl bg-gray-100 px-2 py-4 rounded-md" key={card.id}>
            {/* Preview de uma carta */}
            {cardPreview && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Fundo embaçado */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setCardPreview(false)}
                    ></div>
                    {/* Pop-up da carta individual */}
                    <div className="relative bg-white w-[90%] max-w-md lg:max-w-3xl lg:w-[80%] p-4 rounded-2xl shadow-lg z-10 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1">
                                {favorites && <i
                                    className={`cursor-pointer transition-all ${favorites[card.id]
                                        ? "fa-solid fa-star text-yellow-400"
                                        : "fa-regular fa-star text-gray-400"
                                        }`}
                                    onClick={() => toggleFavorite?.(card)}
                                ></i>}
                                <p className="text-xl">{card.name} - ({card.localId} / {card.set.cardCount.official})</p>
                            </div>
                            <i
                                className="fa-solid fa-xmark text-2xl cursor-pointer hover:text-amber-800 transition-all"
                                onClick={() => setCardPreview(false)}
                            ></i>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-4">
                            <img src={card.image ? `${card.image}/high.png` : placeholder} className="lg:max-w-sm" />
                            <div className="flex flex-col gap-4 w-full">
                                <div className="flex items-center justify-center gap-2 shadow-xl border-gray-300 border py-4">
                                    <p className="text-lg">{card.set.name}</p>
                                    {card.set.symbol && <img className="w-1/10" src={`${card.set.symbol}.png`} />}
                                </div>
                                <p className="text-lg shadow-xl border-gray-300 border py-4 hidden lg:block text-center" >Total de Cartas no Set: {card.set.cardCount.total}</p>
                                <p className="text-lg shadow-xl border-gray-300 border py-4 hidden lg:block text-center" >Raridade: {card.rarity}</p>
                                <p className="shadow-xl border-gray-300 border py-4 text-center text-lg">{card.illustrator ? card.illustrator : "Não informado"}</p>
                                {addCard &&
                                    <div className="flex items-center justify-evenly px-2">
                                        <i
                                            className="fa-solid fa-minus text-red-500 cursor-pointer"
                                            onClick={() => removeCard?.(card)}
                                        ></i>
                                        <p className="w-1/2 text-center">
                                            {card.quantity ?? userCards?.[card.id] ?? 0}
                                        </p>
                                        <i
                                            className="fa-solid fa-plus text-green-500 cursor-pointer"
                                            onClick={() => addCard(card)}
                                        ></i>
                                    </div>}
                                <a className="text-center border p-3 border-amber-800 text-amber-800 rounded-2xl hover:text-black hover:border-black" href={`https://www.ligapokemon.com.br/?view=cards/card&card=${card.name.replace(" ", "%20")}(${card.localId}/${card.set.cardCount.official.toString().length < card.localId.length ? `0${card.set.cardCount.official}` : card.set.cardCount.official})`} target="_blank">LigaPokemon</a>
                            </div>
                        </div>
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
                    onError={() => handleImageLoad(card.id)}
                    className={`w-full transition-opacity duration-300 ${loadedImages[card.id] ? "opacity-100" : "opacity-0"}`}
                />
            </div>
            <div className="flex items-center justify-between">
                <h3>{card.name}</h3>
                <div className="flex items-center gap-2">
                    {addToBinder && (
                        <div className="relative">
                            <i
                                className="fa-solid fa-folder-plus text-amber-800 hover:text-black hover:cursor-pointer transition-all"
                                onClick={() => setBinderMenu(true)}
                            ></i>
                            {binderMenu && (
                                <BinderMenu
                                    card={card}
                                    onClose={() => setBinderMenu(false)}
                                    onSuccess={onBinderSuccess}
                                />
                            )}
                        </div>
                    )}
                    {toggleWishlist && (
                        <div className="relative">
                            <i
                                className={`cursor-pointer transition-all ${wishlist?.[card.id]
                                    ? "fa-solid fa-circle-check text-green-400"
                                    : "fa-solid fa-clipboard-list text-amber-800"
                                    }`}
                                onClick={() => toggleWishlist?.(card)}
                            ></i>
                        </div>
                    )}
                    <i className="fa-solid fa-circle-info text-amber-800 hover:text-black hover:cursor-pointer transition-all" onClick={() => setCardPreview(true)}></i>
                </div>
            </div>
            <p className="text-sm">{card.set.name}</p>
            <div className="flex gap-1 items-center">
                <p className="text-sm">{card.localId} / {card.set.cardCount.official}</p>
                {favorites && <i
                    className={`cursor-pointer transition-all hover:text-yellow-300 ${favorites[card.id]
                        ? "fa-solid fa-star text-yellow-400"
                        : "fa-regular fa-star text-gray-400"
                        }`}
                    onClick={() => toggleFavorite?.(card)}
                ></i>}
            </div>
            {addCard &&
                <div className="flex items-center justify-between px-2">
                    <i
                        className="fa-solid fa-minus text-red-500 cursor-pointer"
                        onClick={() => removeCard?.(card)}
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
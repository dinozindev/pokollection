import placeholder from "../assets/card-placeholder.png"

type CardProps = {
    loadedImages: Record<string, boolean>;
    card: any;
    handleImageLoad: (id: string) => void;
    favorites: Record<string, boolean>;
    toggleFavorite: any;
    removeCard: any;
    addCard: any;
    userCards: Record<string, number>;
}

const CardDiv = ({loadedImages, card, handleImageLoad, favorites, toggleFavorite, removeCard, addCard, userCards} : CardProps) => {
  return (
     <div className="w-2/5 flex flex-col gap-1.5 justify-between shadow-xl bg-gray-100 px-2 py-4 rounded-md" key={card.id}>
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
                            <i className="fa-solid fa-circle-info text-amber-800 hover:text-black transition-all"></i>
                        </div>
                        <p className="text-sm">{card.set.name}</p>
                        <div className="flex gap-1 items-center">
                            <p className="text-sm">{card.localId} / {card.set.cardCount.official}</p>
                            <i
                                className={`cursor-pointer transition-all ${favorites[card.id]
                                    ? "fa-solid fa-star text-yellow-400"
                                    : "fa-regular fa-star text-gray-400"
                                    }`}
                                onClick={() => toggleFavorite(card)}
                            ></i>
                        </div>
                        <div className="flex items-center justify-between px-2">
                            <i
                                className="fa-solid fa-minus text-red-500 cursor-pointer"
                                onClick={() => removeCard(card)}
                            ></i>
                            <p className="w-1/2 text-center">
                                {userCards[card.id] ?? 0}
                            </p>
                            <i
                                className="fa-solid fa-plus text-green-500 cursor-pointer"
                                onClick={() => addCard(card)}
                            ></i>
                        </div>
                    </div>
  )
}

export default CardDiv
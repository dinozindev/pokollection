import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useWishlist } from "../../hooks/useWishlist";
import type { CardUser } from "../../types/type";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import CardDiv from "../../components/CardDiv";

const WishList = () => {
    const {user} = useContext(AuthContext);
    const { toggleWishlist } = useWishlist();
    const [wishlistedCards, setWishlistedCards] = useState<CardUser[]>([]);
    const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

    const handleImageLoad = (id: string) => {
        setLoadedImages((prev) => ({
            ...prev,
            [id]: true
        }));
    };

    useEffect(() => {
            if (!user) return;
            const cardsRef = collection(db, "users", user.uid, "wishlist");
    
            const unsubscribe = onSnapshot(cardsRef, (snapshot) => {
                const cards: CardUser[] = [];
                const wishlistMap: Record<string, boolean> = {};

                snapshot.forEach((doc) => {
                    const data = doc.data() as CardUser;

                    cards.push({
                        ...data,
                        id: doc.id
                    });

                    wishlistMap[doc.id] = true;
                })

                cards.sort((a, b) => {
                    const aTime = a.createdAt instanceof Timestamp ? a.createdAt?.toMillis() : 0;
                    const bTime = b.createdAt instanceof Timestamp ? b.createdAt?.toMillis() : 0;
                    return bTime - aTime;
                });
    
                setWishlistedCards(cards);
                setWishlist(wishlistMap);
            });
    
    
            return () => unsubscribe();
        }, [user]);
    


  return (
    <section className="flex items-center py-30 flex-col min-h-screen">
            <h2 className="text-4xl font-medium text-amber-800 mt-4 bg-white p-4 rounded-xl shadow-xl">Wishlist</h2>
            <div className="flex items-center pb-10 gap-3">
            </div>
            <div className={`flex flex-wrap justify-center gap-6 ${wishlistedCards.length <= 2 ? "w-full" : ""}`}>
                {wishlistedCards.length !== 0 ? wishlistedCards?.map(card => (
                    <CardDiv key={card.id} loadedImages={loadedImages} card={card} handleImageLoad={handleImageLoad} wishlist={wishlist} addToBinder={!!user} toggleWishlist={toggleWishlist}  />
                )) : <p>Nenhuma carta em sua wishlist ainda!</p>}
            </div>
        </section>
  )
}

export default WishList
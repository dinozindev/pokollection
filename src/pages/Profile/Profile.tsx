import { useContext, useEffect, useState } from "react";
import profileImage from "../../assets/profile-placeholder.png";
import { AuthContext } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";


const Profile = () => {
    const { user } = useContext(AuthContext);

    const [userData, setUserData] = useState<any>();

    const fetchUserInfo = async () => {
        if (!user) return;

        const docRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(docRef);
        console.log("snapshot", snapshot.exists(), snapshot.data());
        if (snapshot.exists()) {
            setUserData(snapshot.data());
        }
        
    }

    useEffect(() => {
        fetchUserInfo();
    }, [user])

  return (
    <section className="pt-30 flex flex-col items-center">
        <img src={profileImage} className="rounded-full w-1/2 absolute" />
        <div className="flex flex-col items-center gap-4 bg-gray-100 h-screen rounded-t-4xl mt-30 pt-30 w-full">
            <h3 className="text-2xl">{userData?.username}</h3>
            <p className="opacity-50">{userData?.email}</p>
            <div className="flex gap-4 justify-center flex-wrap mt-4">
                <div className="w-1/3 bg-gray-300 p-4 h-30 rounded-2xl">
                    <p>Cartas: 1</p>
                </div>
                <div className="w-1/3 bg-gray-300 p-4 h-30 rounded-2xl">
                    <p>Pokémon favorito: {userData?.favoritePokemon ?? "Nenhum"}</p>
                </div>
                <div className="w-1/3 bg-gray-300 p-4 h-30 rounded-2xl">
                    <p>Outro card</p>
                </div>
                <div className="w-1/3 bg-gray-300 p-4 h-30 rounded-2xl">
                    <p>Outro card</p>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Profile
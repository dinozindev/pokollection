import { useContext } from "react"
import { AuthContext } from "../context/AuthContext";
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const useFriends = () => {
    const { user } = useContext(AuthContext);

    const toggleFollow = async (targetUser: any) => {
        if (!user) return;

        const followingRef = doc(db, "users", user.uid, "following", targetUser.id);
        const snapshot = await getDoc(followingRef);

        if (snapshot.exists()) {
            await deleteDoc(followingRef);
            await deleteDoc(doc(db, "users", targetUser.id, "followers", user.uid));
        } else {

            await setDoc(followingRef, {
                uid: targetUser.id,
                seguidoEm: serverTimestamp()
            });

            await setDoc(doc(db, "users", targetUser.id, "followers", user.uid), {
                uid: user.uid,
                seguidoEm: serverTimestamp()
            });
        }
    };

    return { toggleFollow };
};
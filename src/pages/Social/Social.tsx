import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import type { CompleteUser } from "../../types/type";
import UserCard from "../../components/UserCard";

const Social = () => {

  const { user } = useContext(AuthContext);
  const [allUsers, setAllUsers] = useState<CompleteUser[]>();

  // busca todos os usuário menos a si próprio
  useEffect(() => {
    if (!user) return;

    const usersRef = collection(db, "users");

    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const users: CompleteUser[] = snapshot.docs
        .map((doc) => ({
          ...(doc.data() as Omit<CompleteUser, "id">),
          id: doc.id,
        }))
        .filter((u) => u.id !== user.uid);

      console.log(users);

      setAllUsers(users);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <section className="flex items-center py-30 flex-col min-h-screen">
      <h2 className="text-4xl font-medium text-amber-800 mt-4 bg-white p-4 rounded-xl shadow-xl">Perfis</h2>
      <div className="flex items-center pb-10 gap-3">
      </div>
      <div className="flex justify-center flex-wrap gap-4">
        {allUsers?.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </section>
  )
}

export default Social;
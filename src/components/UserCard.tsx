import type { CompleteUser } from '../types/type'
import profileImage from "../assets/profile-placeholder.png";
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';

type UserCardProps = {
    user: CompleteUser;
}

const UserCard = ({ user }: UserCardProps) => {

    const { user: authUser } = useContext(AuthContext);
    const isOwnProfile = authUser?.uid === user.id;

    const [followersCount, setFollowersCount] = useState<number>(0);

    useEffect(() => {
        const followersRef = collection(
            db,
            "users",
            user.id,
            "followers"
        );

        const unsubscribeFollowers = onSnapshot(followersRef, (snapshot) => {
            setFollowersCount(snapshot.size);
        });

        return () => {
            unsubscribeFollowers();
        };
    }, [user])

    return (
        <div className="w-8/10 flex bg-white shadow-xl rounded-2xl py-2 pl-2 pr-4 items-center justify-between">
            <div className="flex items-center w-2/3 gap-4">
                <img className="w-20 h-20 object-cover rounded-full border-2 border-amber-800" src={user.avatar || profileImage} />
                <div className="flex items-center justify-between w-2/3">
                    <div>
                        <h2 className="text-xl">{user.username}</h2>
                        <p className='text-sm'><span className="text-amber-800">{followersCount}</span> {followersCount != 1 ? "Seguidores" : "Seguidor"}</p>
                    </div>
                </div>
            </div>
            <Link className="bg-amber-800 text-white py-2 px-4 rounded-xl hover:text-amber-800 hover:bg-white hover:border hover: border-amber-800 transition-all shadow-2xl font-medium" to={isOwnProfile ? "/profile" : `/profile/${user.id}`}>Perfil</Link>
        </div>
    )
}

export default UserCard
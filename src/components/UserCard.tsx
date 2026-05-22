import type { CompleteUser } from '../types/type'
import profileImage from "../assets/profile-placeholder.png";
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

type UserCardProps = {
    user: CompleteUser;
}

const UserCard = ({ user }: UserCardProps) => {

    const { user: authUser } = useContext(AuthContext);

    const isOwnProfile = authUser?.uid === user.id;

    return (
        <div className="w-9/10 flex bg-white shadow-xl rounded-2xl py-2 pl-2 pr-4 items-center">
            <div className="flex items-center w-1/3">
                <img className="w-20 h-20 object-cover rounded-2xl border-2 border-amber-800" src={user.avatar || profileImage} />
            </div>
            <div className="flex items-center justify-between w-2/3">
                <h2>{user.username}</h2>
                <Link className="bg-amber-800 text-white py-2 px-4 rounded-xl hover:text-amber-800 hover:bg-white transition-all shadow-2xl font-medium" to={isOwnProfile ? "/profile" : `/profile/${user.id}`}>Perfil</Link>
            </div>
        </div>
    )
}

export default UserCard
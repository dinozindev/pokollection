import type { CompleteUser } from '../types/type'
import profileImage from "../assets/profile-placeholder.png";
import { Link } from 'react-router-dom';

type UserCardProps = {
    user: CompleteUser;
}

const UserCard = ({ user }: UserCardProps) => {
    return (
        <div className="w-9/10 flex bg-white shadow-xl rounded-2xl py-2 pl-2 pr-4 items-center justify-evenly">
            <div className="flex items-center gap-3">
                <img className="w-1/4 rounded-2xl" src={user.avatar || profileImage} />
                <h2>{user.username}</h2>
            </div>
            <Link className="bg-amber-800 text-white py-2 px-4 rounded-xl" to={`/social/${user.id}`}>Perfil</Link>
        </div>
    )
}

export default UserCard
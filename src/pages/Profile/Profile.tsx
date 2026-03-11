import profileImage from "../../assets/profile-placeholder.png";


const Profile = () => {
  return (
    <section className="pt-30">
        <div className="flex flex-col items-center gap-4">
            <img src={profileImage} className="rounded-full w-1/2" />
            <h3 className="text-2xl">Usuário</h3>
            <p className="opacity-50">E-mail</p>
            <div className="flex gap-4 justify-center">
                <div className="w-1/4 bg-gray-100 p-2">
                    <p>Cartas: 1</p>
                </div>
                <div className="w-1/4 bg-gray-100 p-2">
                    <p>Pokémon favorito: Golisopod</p>
                </div>
                <div className="w-1/4 bg-gray-100 p-2">
                    <p>Outro card</p>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Profile
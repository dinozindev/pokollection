
const ProfileCard = ({children} : any) => {
    return (
        <div className="w-1/2 bg-gray-300 p-4 h-30 flex flex-col">
            {children}
        </div>
    )
}

export default ProfileCard
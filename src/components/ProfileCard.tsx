const ProfileCard = ({children} : any) => {
    return (
        <div className="w-1/2 p-4 h-40 flex flex-col border border-gray-300">
            {children}
        </div>
    )
}

export default ProfileCard
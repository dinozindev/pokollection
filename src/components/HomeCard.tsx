type HomeCardProps = {
    children: any;
    title: string;
    description: string;
}

const HomeCard = ({ children, title, description } : HomeCardProps) => {
  return (
    <div className="bg-white p-4 flex flex-col items-center shadow-2xl">
        {children}
        <h3 className="text-2xl font-medium">{title}</h3>
        <p className="text-center">{description}</p>
    </div>
  )
}

export default HomeCard
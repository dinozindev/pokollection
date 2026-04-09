type HomeCardProps = {
  children: any;
  title: string;
  description: string;
}

const HomeCard = ({ children, title, description }: HomeCardProps) => {
  return (
    <div className="bg-white p-4 flex flex-col items-center shadow-2xl h-[60%] justify-center gap-15">
      {children}
      <div className="flex flex-col items-center">
        <h3 className="text-2xl font-medium">{title}</h3>
        <p className="text-center">{description}</p>
      </div>
    </div>
  )
}

export default HomeCard
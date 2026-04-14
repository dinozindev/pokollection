type HomeCardProps = {
  children: any;
  title: string;
  description: string;
}

const HomeCard = ({ children, title, description }: HomeCardProps) => {
  return (
    <div className="bg-white p-2 flex flex-col items-center shadow-xl w-full justify-center gap-10 hover:scale-105 transition-transform cursor-pointer py-10 rounded-2xl">
      {children}
      <div className="flex flex-col items-center gap-2 text-amber-950">
        <h3 className="text-xl font-semibold text-center">{title}</h3>
        <p className="text-center text-md lg:block hidden">{description}</p>
      </div>
    </div>
  )
}

export default HomeCard
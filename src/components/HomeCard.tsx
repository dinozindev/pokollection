type HomeCardProps = {
  children: any;
  title: string;
  description: string;
}

const HomeCard = ({ children, title, description }: HomeCardProps) => {
  return (
    <div className="bg-white p-2 flex flex-col items-center shadow-2xl w-full justify-center gap-8 hover:-translate-y-4 transition-all cursor-pointer py-10">
      {children}
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-xl font-medium text-center">{title}</h3>
        <p className="text-center text-md lg:block hidden">{description}</p>
      </div>
    </div>
  )
}

export default HomeCard
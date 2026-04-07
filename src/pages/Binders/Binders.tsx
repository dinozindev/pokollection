import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useBinders } from "../../hooks/useBinders";
import type { BinderWithCards } from "../../types/type";
import { Link } from "react-router-dom";
import placeholder from "../../assets/card-placeholder.png";


const Binders = () => {

  const { fetchAllBindersWithCards } = useBinders();
  const [binders, setBinders] = useState<BinderWithCards[]>([]);
  

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchAllBindersWithCards().then(result => {
      if (result) setBinders(result);
    });
  }, [user]);

  return (
    <section className="flex items-center py-30 flex-col min-h-screen">
      <h2 className="text-4xl font-medium text-amber-800 mt-4 bg-white p-4 rounded-xl shadow-xl mb-10">Meus Binders</h2>
      <div className="flex gap-4 flex-wrap justify-center w-full">
        {binders?.map(binder => (
          <Link to={`/binders/${binder.id}`} className="bg-white p-6 w-1/2 lg:w-1/4 h-100 md:h-110 lg:h-120 flex flex-col items-center gap-4 cursor-pointer hover:-translate-y-2 transition-all rounded-xl" key={binder.id}>
            <h3 className="text-2xl">{binder.nome}</h3>
            <div className="grid grid-cols-2 gap-1">
              {binder.cartas?.slice(0, 4).map(carta => (
                <img className="w-30" src={carta.image ? `${carta.image}/high.png` : placeholder} key={carta.image}/>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Binders;
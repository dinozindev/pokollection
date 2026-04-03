import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useBinders } from "../../hooks/useBinders";
import type { BinderWithCards } from "../../types/type";

const Binders = () => {

  const { fetchAllBindersWithCards } = useBinders();
  const [binders, setBinders] = useState<BinderWithCards[]>([]);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchAllBindersWithCards().then(result => {
      if (result) setBinders(result);
      console.log(result);
    });
  }, [user]);

  return (
    <section className="flex items-center py-30 flex-col min-h-screen">
      <h2 className="text-4xl font-medium text-amber-800 mt-4 bg-white p-4 rounded-xl shadow-xl mb-10">Meus Binders</h2>
      <div className="flex gap-4">
        {binders?.map(binder => (
          <div className="bg-white p-6 w-1/2 flex flex-col items-center gap-4">
            <h3 className="text-2xl">{binder.nome}</h3>
            <div className="flex flex-wrap justify-center gap-1">
              {binder.cartas?.map(carta => (
                <img className="w-40" src={`${carta.image}/high.png`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Binders;
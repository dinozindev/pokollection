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
        {/* Lista de binders */}
        {binders.length !== 0 ? binders?.map(binder => (
          <Link
            to={`/binders/${binder.id}`}
            key={binder.id}
            className="group bg-slate-50 p-5 w-full sm:w-1/2 lg:w-1/4 flex flex-col items-center gap-6 cursor-pointer hover:bg-white hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 rounded-2xl border border-slate-200"
          >
            <h3 className="text-xl font-bold text-slate-800 group-hover:text-amber-700 transition-colors">
              {binder.nome}
            </h3>
            <div className="grid grid-cols-2 gap-2 bg-slate-200 p-2 rounded-lg shadow-inner w-full">
              {binder.cartas?.slice(0, 4).map((carta, index) => (
                <div key={index} className="relative w-full aspect-7/10 overflow-hidden rounded-md shadow-sm bg-white">
                  <img
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    src={carta.image ? `${carta.image}/high.png` : placeholder}
                    alt="Pokémon Card"
                  />
                </div>
              ))}
              {/* placeholder */}
              {Array.from({ length: Math.max(0, 4 - (binder.cartas?.length || 0)) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="w-full aspect-7/10 bg-slate-300/50 border-2 border-dashed border-slate-400/30 rounded-md flex items-center justify-center"
                >
                </div>
              ))}
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {binder.cartas?.length || 0} Cartas
            </span>
          </Link>
        )) : <p>Nenhum binder criado ainda!</p>}
      </div>
    </section>
  )
}

export default Binders;
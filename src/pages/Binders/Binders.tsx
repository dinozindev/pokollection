import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useBinders } from "../../hooks/useBinders";
import type { BinderWithCards } from "../../types/type";
import BinderCard from "../../components/BinderCard";


const Binders = () => {

  const { fetchAllBindersWithCards, createBinder } = useBinders();
  const [binders, setBinders] = useState<BinderWithCards[]>([]);
  const [binderWindow, setBinderWindow] = useState<boolean>(false);
  const [binderName, setBinderName] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchAllBindersWithCards().then(result => {
      if (result) setBinders(result);
    });
  }, [user]);

  const handleCreateBinder = async (nome: string) => {
    await createBinder(nome);

    const result = await fetchAllBindersWithCards();
    if (result) setBinders(result);

    setBinderWindow(false);
    setShow(true);
    setBinderName("");

    setTimeout(() => {
      setShow(false);
    }, 3000)
  }

  return (
    <section className="flex items-center py-30 flex-col min-h-screen">
      {binderWindow && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Fundo embaçado */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setBinderWindow(false)}
          ></div>
          {/* Pop-up de remoção */}
          <div className="relative bg-white w-4/5 max-w-md p-4 rounded-2xl shadow-lg z-10">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xl">Criar Binder</p>
              <i
                className="fa-solid fa-xmark text-2xl cursor-pointer hover:text-amber-800 transition-all"
                onClick={() => setBinderWindow(false)}
              ></i>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="input__username">Nome</label>
              <input
                id="input__username"
                type="text"
                className="border p-2 rounded"
                value={binderName}
                onChange={(e) => {
                  setBinderName(e.target.value);
                }}
              />
              <button
                type="submit"
                className="bg-transparent p-2 mt-4 rounded-2xl border-amber-800 border-2 text-amber-800 cursor-pointer hover:text-black hover:border-black transition-all"
                onClick={() => handleCreateBinder(binderName)}
              >
                Criar Binder
              </button>
            </div>
          </div>
        </div>
      )
      }
      <div className="flex items-center mt-4 mb-10 gap-8">
        <h2 className="text-4xl font-medium text-amber-800 bg-white p-4 rounded-xl shadow-xl">Meus Binders</h2>
        <i
          className="fa-solid fa-plus bg-white pr-10 pl-5 py-6 text-2xl rounded-xl hover:bg-amber-800 hover:text-white transition-all cursor-pointer"
          onClick={() => setBinderWindow(true)}
        ></i>
      </div>
      <div className="flex gap-4 flex-wrap justify-center w-full">
        {/* Lista de binders */}
        {binders.length !== 0 ? binders?.map(binder => (
          <BinderCard binder={binder}/>
        )) : <p>Nenhum binder criado ainda!</p>}
      </div>
      {show && (
        <div className="fixed bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in z-20">
          Binder criado com sucesso!
        </div>
      )}
    </section >
  )
}

export default Binders;
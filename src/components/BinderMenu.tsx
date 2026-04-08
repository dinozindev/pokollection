import { useContext, useEffect, useState } from "react";
import { useBinders } from "../hooks/useBinders";
import type { Binder, CardUser } from "../types/type";
import { AuthContext } from "../context/AuthContext";

type BinderMenuProps = {
  card: CardUser;
  onClose: () => void;
  onSuccess: ((message: string) => void) | undefined
}

const BinderMenu = ( { card, onClose, onSuccess }: BinderMenuProps ) => {
  const { fetchBinders, createBinder, addCardToBinder } = useBinders();
  const [binders, setBinders] = useState<Binder[]>([]);
  const [novaBinder, setNovaBinder] = useState('');
  const [criando, setCriando] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchBinders().then(result => {
      if (result) setBinders(result);
    });
  }, [user]);

  const handleEscolherBinder = async (binderId: string, binderNome: string) => {
    const adicionou = await addCardToBinder(binderId, card);
    onClose();
    if (adicionou) {
        onSuccess?.(`${card.name} adicionado ao binder "${binderNome}"!`);
    } else {
        onSuccess?.(`${card.name} já está no binder "${binderNome}"!`);
    }
};

  const handleCriarEAdicionar = async () => {
    if (!novaBinder.trim()) return;
    const docRef = await createBinder(novaBinder);
    if (!docRef) return;
    await addCardToBinder(docRef.id, card);
    onClose();
    onSuccess?.(`${card.name} adicionado ao binder "${novaBinder}"!`);
  };

  return (
    <>
      {/* overlay transparente para fechar ao clicar fora */}
      <div
        className="fixed inset-0 z-20"
        onClick={onClose}
      ></div>
      <div className="absolute bg-white shadow-lg rounded-xl p-3 z-30 w-64">
        <p className="text-sm font-medium mb-2">Adicionar ao binder</p>

        {binders.map((binder: any) => (
          <button key={binder.id} onClick={() => handleEscolherBinder(binder.id, binder.nome)}
            className="w-full text-left px-2 py-1 hover:bg-amber-50 rounded text-sm cursor-pointer">
            {binder.nome}
          </button>
        ))}

        {criando ? (
          <div className="flex gap-2 mt-2">
            <input
              className="border rounded px-2 py-1 text-sm flex-1"
              placeholder="Nome do binder"
              value={novaBinder}
              onChange={e => setNovaBinder(e.target.value)}
            />
            <button onClick={handleCriarEAdicionar}
              className="text-amber-800 text-sm font-medium cursor-pointer">
              Ok
            </button>
          </div>
        ) : (
          <button onClick={() => setCriando(true)}
            className="w-full text-left px-2 py-1 mt-2 text-amber-800 text-sm border-t ">
            <p className="mt-2 hover:bg-amber-50 hover:text-black transition-all cursor-pointer">+ Novo binder</p>
          </button>
        )}
      </div>
    </>
  );
};

export default BinderMenu;
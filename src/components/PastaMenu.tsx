import { useEffect, useState } from "react";
import { useBinders } from "../hooks/useBinders";
import type { Binder } from "../types/type";

const BinderMenu = ({ card, onClose }: any) => {
  const { fetchBinders, criarBinder, adicionarCartaNaBinder } = useBinders();
  const [binders, setBinders] = useState<Binder[]>([]);
  const [novaBinder, setNovaBinder] = useState('');
  const [criando, setCriando] = useState(false);

  useEffect(() => {
    fetchBinders().then(result => {
        if (result) setBinders(result);
    });
}, []);

  const handleEscolherBinder = async (binderId: string) => {
    await adicionarCartaNaBinder(binderId, card);
    onClose();
  };

  const handleCriarEAdicionar = async () => {
    if (!novaBinder.trim()) return;
    const docRef = await criarBinder(novaBinder);
    if (!docRef) return;
    await adicionarCartaNaBinder(docRef.id, card);
    onClose();
};

  return (
    <div className="absolute bg-white shadow-lg rounded-xl p-3 z-30 w-52">
      <p className="text-sm font-medium mb-2">Adicionar ao binder</p>

      {binders.map((binder: any) => (
        <button key={binder.id} onClick={() => handleEscolherBinder(binder.id)}
          className="w-full text-left px-2 py-1 hover:bg-amber-50 rounded text-sm">
          {binder.nome}
        </button>
      ))}

      {criando ? (
        <div className="flex gap-1 mt-2">
          <input
            className="border rounded px-2 py-1 text-sm flex-1"
            placeholder="Nome do binder"
            value={novaBinder}
            onChange={e => setNovaBinder(e.target.value)}
          />
          <button onClick={handleCriarEAdicionar}
            className="text-amber-800 text-sm font-medium">
            Ok
          </button>
        </div>
      ) : (
        <button onClick={() => setCriando(true)}
          className="w-full text-left px-2 py-1 mt-2 text-amber-800 text-sm border-t">
          + Novo binder
        </button>
      )}
    </div>
  );
};

export default BinderMenu;
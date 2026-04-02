import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useBinders } from "../../hooks/useBinders";
import type { Binder } from "../../types/type";

const Binders = () => {

    const { fetchBinders } = useBinders();
    const [binders, setBinders] = useState<Binder[]>([]);

    const { user } = useContext(AuthContext);

    useEffect(() => {
      fetchBinders().then(result => {
        if (result) setBinders(result);
      });
    }, [user]);

  return (
    <div>Binder</div>
  )
}

export default Binders;
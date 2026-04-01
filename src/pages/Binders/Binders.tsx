import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

const Binders = () => {

    const { user } = useContext(AuthContext);

  return (
    <div>Binder</div>
  )
}

export default Binders;
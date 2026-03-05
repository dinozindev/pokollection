import axios from "axios";

const client = axios.create({
    baseURL: "https://api.pokemontcg.io/v2",
    headers: {
        "X-Api-Key": import.meta.env.POKEMONAPI_KEY
    }
})

export default client;

export type User = {
    email: string;
    password: string;
    username: string;
}

type CardCount = {
    official: number;
    total: number;
}

type Set = {
    cardCount: CardCount;
    id: string;
    logo: string;
    name: string;
    symbol: string;
}

export type CardUser = {
    id: string;
    illustrator: string;
    image: string;
    localId: string;
    name: string;
    quantity: number;
    set: Set;
}

export type ProfileInfo = {
    username: string;
    favoritePokemon: string;
    avatar: string;
    bio: string;
    favoriteType: string;
    favoriteGen: string;
}

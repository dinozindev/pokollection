import type { FieldValue, Timestamp } from "firebase/firestore";

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

export type Binder = {
    id: string;
    nome: string;
}

export type BinderWithCards = Binder & {
    cartas: CardUser[];
    color?: string;
}

export type CardUser = {
    id: string;
    illustrator: string;
    image: string;
    localId: string;
    name: string;
    quantity: number;
    set: Set;
    rarity: string;
    createdAt?: Timestamp | FieldValue;
}

export type ProfileInfo = {
    username: string;
    favoritePokemon: string;
    avatar: string;
    bio: string;
    favoriteType: string;
    favoriteGen: string;
}

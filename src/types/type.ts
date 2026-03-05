type SetImages = {
    symbol: string;
    logo: string;
}

export type Set = {
    id: string;
    name: string;
    series: string;
    printedTotal: number;
    total: number;
    releaseDate: string;
    images: SetImages;
}


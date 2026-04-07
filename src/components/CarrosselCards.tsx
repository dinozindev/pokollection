const CarrosselCards = ({ cartas }: any) => {
    return (
        <div className="overflow-hidden w-full">
            <div className="flex animate-marquee gap-4 w-max">
                {[...cartas, ...cartas].map((carta, index) => (
                    <img
                        key={index}
                        src={`${carta.image}/low.png`}
                        className="flex-none w-36 rounded-lg"
                    />
                ))}
            </div>
        </div>
    );
};

export default CarrosselCards
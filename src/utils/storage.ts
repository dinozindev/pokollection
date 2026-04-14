export const limparCacheExpirado = () => {
    const agora = Date.now();

    Object.keys(localStorage)
        .filter(key => key.startsWith('@tcgdex-cache/'))
        .forEach(key => {
            try {
                const item = JSON.parse(localStorage.getItem(key) || '{}');
                if (item.expire && item.expire < agora) {
                    localStorage.removeItem(key);
                }
            } catch {
                localStorage.removeItem(key);
            }
        });
};

export const limparCacheMaisAntigo = () => {
    const entries = Object.keys(localStorage)
        .filter(key => key.startsWith('@tcgdex-cache/'))
        .map(key => {
            try {
                const item = JSON.parse(localStorage.getItem(key) || '{}');
                return { key, expire: item.expire || 0 };
            } catch {
                return { key, expire: 0 };
            }
        })
        .sort((a, b) => a.expire - b.expire); // ordena do que expira mais cedo para o mais tarde

    if (entries.length > 0) {
        localStorage.removeItem(entries[0].key);
    }
};

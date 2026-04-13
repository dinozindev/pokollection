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
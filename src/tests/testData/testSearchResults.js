export const testSearchResults = (() => {
    const result = [[], []];

    for (let i = 0; i < 17; i++) {
        const page = Math.floor(i / 10);
        result[page].push({
            alt_description: 'alt text' ,
            height: 1920,
            id: 'image-' + i,
            links: { html: `/image-link${i}.html` },
            urls: { regular: `/image${i}.jpg`, small: `/image${i}-small.jpg` },
            user: { id: `user-${i}`, links: { html: `/user${i}-link.html` }, name: `User${i} Name` },
            width: 1080,
        });
    }

    return result;
})();
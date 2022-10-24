export const handlebarsHelpers = {
    findPrice: (entries: any[], selectedItem: any): number => {
        const found = entries.find((el: any[]) => el[0] === selectedItem);

        if (!found) {
            throw new Error(`Cannot find price of "${selectedItem}".`);
        }

        const [, price] = found;
        return price;
    },

    pricify: (price: number) => price.toFixed(2),

    isNotInArray: (array: string[], element: any) => !array.includes(element),

    isInArray: (array: string | any[], element: any) => array.includes(element),
};


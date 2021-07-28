declare module 'get-cat-facts' {
    export const random: () => Promise<Item[]>;

    interface Item {
        text: string;
    }
}
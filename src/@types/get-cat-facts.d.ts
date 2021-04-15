declare module 'get-cat-facts' {
    export const random: () => Item[];

    interface Item {
        text: string;
    }
}
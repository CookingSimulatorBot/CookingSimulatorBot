declare module 'random-stuff-api' {
    export const random: Jokes;
    export const image: Images;

    interface Jokes {
        async joke(): Promise<string>;
        async cnjoke(): Promise<string>;
        async devjoke(): Promise<string>;
    }

    interface Images {
        async cat(): Promise<string>;
        async dog(): Promise<string>;
        async duck(): Promise<string>;
        async vase(): Promise<string>;
    }
}
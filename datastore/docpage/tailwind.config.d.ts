export let content: string[];
export namespace theme {
    namespace extend {
        let colors: {
            'ulixee-normal': string;
            'ulixee-verylight': string;
        };
    }
}
export namespace variants {
    let extend_1: {};
    export { extend_1 as extend };
}
export let plugins: typeof import("@tailwindcss/forms")[];

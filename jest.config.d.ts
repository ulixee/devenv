export let verbose: boolean;
export let testMatch: string[];
export let testEnvironment: string;
export let collectCoverage: boolean;
export let transform: {};
export let globalSetup: string;
export let setupFilesAfterEnv: string[];
export let globalTeardown: string;
export let testTimeout: number;
export let reporters: (string | (string | {
    silent: boolean;
})[])[];
export let roots: string[];
export let moduleDirectories: string[];
export let modulePathIgnorePatterns: string[];
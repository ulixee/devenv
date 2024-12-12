export default class ArgonUtils {
    static ArgonSymbol: string;
    static MicrogonsSymbol: string;
    static MicrogonsPerArgon: bigint;
    static parseUnits(units: string, output: 'microgons'): bigint;
    static parseUnits(units: string, output: 'argons'): bigint;
    static printArgons(argons: number): string;
    static format(value: number | bigint, fromUnits: 'microgons' | 'argons', toUnits?: 'microgons' | 'argons'): string;
    private static microgonsToArgons;
    private static microgonsToRoundedArgons;
}

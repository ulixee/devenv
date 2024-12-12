"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArgonUtils {
    static parseUnits(units, output) {
        if (!units.endsWith(this.MicrogonsSymbol) && !units.endsWith('a')) {
            units += this.MicrogonsSymbol;
        }
        let value = BigInt(units.substring(0, units.length - 1));
        if (output === 'microgons') {
            if (units.endsWith('a'))
                value = this.microgonsToArgons(value);
            return value;
        }
        // else argons
        if (units.endsWith(this.MicrogonsSymbol))
            return this.microgonsToArgons(value);
        return value;
    }
    static printArgons(argons) {
        let argonsb = argons;
        const prefix = argonsb < 0 ? '-' : '';
        if (argonsb < 0) {
            argonsb *= -1;
        }
        return `${prefix}${this.ArgonSymbol}${argonsb}`;
    }
    static format(value, fromUnits, toUnits) {
        if (typeof value === 'number') {
            value = BigInt(value);
        }
        if (fromUnits === 'microgons') {
            if (toUnits === 'argons' || value % this.MicrogonsPerArgon === 0n) {
                const argons = this.microgonsToRoundedArgons(value);
                return this.printArgons(argons);
            }
            return `${value}${this.MicrogonsSymbol}`;
        }
        if (toUnits === 'microgons') {
            return `${value * this.MicrogonsPerArgon}${this.MicrogonsSymbol}`;
        }
        return this.printArgons(Number(value));
    }
    static microgonsToArgons(microgons) {
        if (typeof microgons === 'number') {
            microgons = BigInt(microgons);
        }
        return microgons / this.MicrogonsPerArgon;
    }
    static microgonsToRoundedArgons(microgons) {
        return Math.round(Number(this.microgonsToArgons(microgons) * 1000n)) / 1000;
    }
}
ArgonUtils.ArgonSymbol = '₳';
ArgonUtils.MicrogonsSymbol = 'm';
ArgonUtils.MicrogonsPerArgon = 1000000n;
exports.default = ArgonUtils;
//# sourceMappingURL=ArgonUtils.js.map
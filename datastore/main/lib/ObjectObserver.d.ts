/**
 ISC License (ISC)

 Copyright 2015 Yuri Guller (gullerya@gmail.com)
 Modifications 2021 Data Liberation Foundation

 Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted,
 provided that the above copyright notice and this permission notice appear in all copies.

 THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE
 INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS.
 IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES
 OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT,
 NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */
import IObservableChange from '../interfaces/IObservableChange';
export default class ObjectObserver implements ProxyHandler<any> {
    private static key;
    onChanges: (changes: IObservableChange[]) => void;
    readonly target: any;
    readonly proxy: any;
    readonly proxiedFunctions: {
        [functionName: PropertyKey]: Function;
    };
    get path(): PropertyKey[];
    ownKey: PropertyKey;
    private readonly isArray;
    private parentPath;
    private readonly proxiedArrayMethods;
    constructor(source: any, onChanges?: ObjectObserver['onChanges'], ownKey?: PropertyKey, parentPath?: PropertyKey[]);
    emit(...changes: IObservableChange[]): void;
    detach(): any;
    set(target: any, key: PropertyKey, value: any): boolean;
    get(target: any, key: PropertyKey): any;
    emitTarget(): void;
    deleteProperty(target: any, key: PropertyKey): boolean;
    deepClone(object: any): any;
    serialize(target: any): string;
    toJSON(): any;
    private pop;
    private push;
    private shift;
    private unshift;
    private reverse;
    private sort;
    private copyWithin;
    private splice;
    private fill;
    private getNewSortOrder;
    private updateArrayIndices;
    private observeChild;
    private coerceKey;
    static create<T>(target: T, onChanges?: (changes: IObservableChange[]) => any): T;
    static isObserved(item: any): boolean;
    private static detach;
}
export declare function Observable<T>(source: T): T;

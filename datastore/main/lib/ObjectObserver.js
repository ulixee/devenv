"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observable = Observable;
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
const IObservableChange_1 = require("../interfaces/IObservableChange");
class ObjectObserver {
    get path() {
        const path = [];
        if (this.parentPath.length)
            path.push(...this.parentPath);
        if (this.ownKey !== undefined && this.ownKey !== null)
            path.push(this.ownKey);
        return path;
    }
    constructor(source, onChanges, ownKey = null, parentPath = []) {
        this.proxiedFunctions = {};
        this.isArray = false;
        this.parentPath = [];
        this.proxiedArrayMethods = {
            pop: this.pop,
            push: this.push,
            shift: this.shift,
            unshift: this.unshift,
            reverse: this.reverse,
            sort: this.sort,
            fill: this.fill,
            copyWithin: this.copyWithin,
            splice: this.splice,
        };
        if (!source || typeof source !== 'object') {
            throw new Error('Observable MAY ONLY be created from a non-null object');
        }
        if (ArrayBuffer.isView(source) || Buffer.isBuffer(source) || source instanceof Date) {
            throw new Error('Observable cannot be a Buffer or Date');
        }
        this.ownKey = ownKey;
        this.parentPath = parentPath;
        this.onChanges = onChanges;
        this.isArray = Array.isArray(source);
        const target = this.isArray ? [] : {};
        for (const [key, value] of Object.entries(source)) {
            const storedKey = this.coerceKey(key);
            target[storedKey] = this.observeChild(value, storedKey);
        }
        Object.setPrototypeOf(target, Object.getPrototypeOf(source));
        Object.defineProperty(target, ObjectObserver.key, {
            configurable: true,
            value: this,
        });
        this.proxy = new Proxy(target, this);
        this.target = target;
    }
    emit(...changes) {
        if (!changes.length || !this.onChanges)
            return;
        for (const change of changes) {
            change.value = this.deepClone(change.value);
        }
        this.onChanges(changes);
    }
    detach() {
        delete this.target[ObjectObserver.key];
        return this.target;
    }
    set(target, key, value) {
        const oldValue = target[key];
        if (value !== oldValue) {
            key = this.coerceKey(key);
            value = this.observeChild(value, key);
            target[key] = value;
            ObjectObserver.detach(oldValue);
            const type = oldValue === undefined ? IObservableChange_1.ObservableChangeType.insert : IObservableChange_1.ObservableChangeType.update;
            const path = [...this.path, key];
            this.emit({ type, path, value });
        }
        return true;
    }
    get(target, key) {
        if (typeof target[key] === 'function') {
            if (this.proxiedArrayMethods.hasOwnProperty(key) && this.isArray) {
                return this.proxiedArrayMethods[key].bind(this);
            }
            return target[key].bind(target);
        }
        if (this.proxiedFunctions.hasOwnProperty(key)) {
            return this.proxiedFunctions[key].bind(target);
        }
        return target[key];
    }
    emitTarget() {
        this.emit({
            path: this.path,
            type: IObservableChange_1.ObservableChangeType.insert,
            value: this.deepClone(this.target),
        });
    }
    deleteProperty(target, key) {
        ObjectObserver.detach(target[key]);
        delete target[key];
        key = this.coerceKey(key);
        this.emit({ type: IObservableChange_1.ObservableChangeType.delete, path: [...this.path, key] });
        return true;
    }
    deepClone(object) {
        if (!object)
            return object;
        const type = typeof object;
        if (type === 'string' || type === 'number' || type === 'boolean')
            return object;
        if (Buffer.isBuffer(object))
            return Buffer.from(object);
        if (ArrayBuffer.isView(object))
            return Buffer.from(object.buffer);
        if (object instanceof Date) {
            return new Date(object.getTime());
        }
        if (type === 'object') {
            if (Array.isArray(object)) {
                return object.map(this.deepClone.bind(this));
            }
            const result = {};
            for (const [key, value] of Object.entries(object)) {
                result[key] = this.deepClone(value);
            }
            return result;
        }
        return object;
    }
    serialize(target) {
        if (!target)
            return target;
        if (Buffer.isBuffer(target)) {
            return target.toString('base64');
        }
        if (ArrayBuffer.isView(target)) {
            return Buffer.from(target.buffer).toString('base64');
        }
        if (target instanceof Date) {
            return target.toISOString();
        }
        return target;
    }
    toJSON() {
        return {
            path: this.path,
        };
    }
    // /// PROXIED ARRAY FUNCTIONS
    pop() {
        const target = this.target;
        const poppedIndex = target.length - 1;
        const popResult = ObjectObserver.detach(target.pop());
        this.emit({
            type: IObservableChange_1.ObservableChangeType.delete,
            path: [...this.path, poppedIndex],
        });
        return popResult;
    }
    push(...items) {
        const target = this.target;
        const initialLength = target.length;
        const changes = [];
        items = items.map((x, i) => {
            const value = this.observeChild(x, i + initialLength);
            changes.push({
                type: IObservableChange_1.ObservableChangeType.insert,
                path: [...this.path, i + initialLength],
                value,
            });
            return value;
        });
        const pushResult = target.push(...items);
        this.emit(...changes);
        return pushResult;
    }
    shift() {
        const target = this.target;
        const shiftResult = ObjectObserver.detach(target.shift());
        this.updateArrayIndices();
        this.emit({
            type: IObservableChange_1.ObservableChangeType.delete,
            path: [...this.path, 0],
        });
        return shiftResult;
    }
    unshift(...items) {
        const target = this.target;
        const changes = new Array(items.length);
        items = items.map((x, i) => {
            const value = this.observeChild(x, i);
            changes[i] = { type: IObservableChange_1.ObservableChangeType.insert, path: [i], value };
            return value;
        });
        const unshiftResult = target.unshift(...items);
        this.updateArrayIndices();
        this.emit(...changes);
        return unshiftResult;
    }
    reverse() {
        const target = this.target;
        const prev = [...target];
        target.reverse();
        const newOrder = this.getNewSortOrder(prev);
        this.emit({
            type: IObservableChange_1.ObservableChangeType.reorder,
            path: this.path,
            value: newOrder,
        });
        return this.proxy;
    }
    sort(comparator) {
        const target = this.target;
        const prev = [...target];
        target.sort(comparator);
        const newOrder = this.getNewSortOrder(prev);
        this.emit({
            type: IObservableChange_1.ObservableChangeType.reorder,
            path: this.path,
            value: newOrder,
        });
        return this.proxy;
    }
    copyWithin(insertIndex, copyStart, copyEnd) {
        const target = this.target;
        const length = target.length;
        if (insertIndex < 0)
            insertIndex = Math.max(length + insertIndex, 0);
        copyStart = copyStart ?? 0;
        if (copyStart < 0)
            copyStart = Math.max(length + copyStart, 0);
        if (copyStart > length)
            copyStart = length;
        copyEnd = copyEnd ?? length;
        if (copyEnd < 0)
            copyEnd = Math.max(length + copyEnd, 0);
        if (copyEnd > length)
            copyEnd = length;
        const itemCount = Math.min(copyEnd - copyStart, length - insertIndex);
        if (insertIndex < length && insertIndex !== copyStart && itemCount > 0) {
            const prev = [...target];
            const changes = [];
            target.copyWithin(insertIndex, copyStart, copyEnd);
            for (let i = insertIndex; i < insertIndex + itemCount; i += 1) {
                //	detach overridden observables, if any
                const previousItem = ObjectObserver.detach(prev[i]);
                ObjectObserver.detach(target[i]);
                //	update newly placed observables, if any
                const item = this.observeChild(target[i], i);
                target[i] = item;
                if (typeof item !== 'object' && item === previousItem) {
                    continue;
                }
                changes.push({ type: IObservableChange_1.ObservableChangeType.update, path: [...this.path, i], value: item });
            }
            this.updateArrayIndices();
            this.emit(...changes);
        }
        return this.proxy;
    }
    splice(start, deleteCount, ...items) {
        const target = this.target;
        const startLength = target.length;
        items = items.map(this.observeChild.bind(this));
        const args = [deleteCount, ...items];
        if (args.length === 1 && deleteCount === undefined) {
            args.length = 0;
        }
        const deletedItems = target.splice(start, ...args);
        this.updateArrayIndices();
        for (const deleted of deletedItems) {
            ObjectObserver.detach(deleted);
        }
        let startIndex = start ?? 0;
        if (startIndex < 0)
            startIndex += startLength;
        const deleteOrUpdateCount = deleteCount ?? startLength - startIndex;
        const changes = [];
        let changeCount = 0;
        while (changeCount < deleteOrUpdateCount) {
            const index = startIndex + changeCount;
            if (changeCount < items.length) {
                changes.push({
                    type: IObservableChange_1.ObservableChangeType.update,
                    path: [...this.path, index],
                    value: target[index],
                });
            }
            else {
                changes.push({
                    type: IObservableChange_1.ObservableChangeType.delete,
                    path: [...this.path, index],
                });
            }
            changeCount += 1;
        }
        while (changeCount < items.length) {
            const index = startIndex + changeCount;
            changes.push({
                type: IObservableChange_1.ObservableChangeType.insert,
                path: [...this.path, index],
                value: target[index],
            });
            changeCount += 1;
        }
        this.emit(...changes);
        return deletedItems;
    }
    fill(filVal, start, end) {
        const target = this.target;
        const prev = [...target];
        target.fill(filVal, start, end);
        const changes = [];
        for (let i = 0; i < target.length; i += 1) {
            target[i] = this.observeChild(target[i], i);
            if (prev[i] !== target[i]) {
                const type = i in prev ? IObservableChange_1.ObservableChangeType.update : IObservableChange_1.ObservableChangeType.insert;
                if (i in prev)
                    ObjectObserver.detach(prev[i]);
                changes.push({ type, path: [...this.path, i], value: target[i] });
            }
        }
        if (changes.length)
            this.emit(...changes);
        return this.proxy;
    }
    getNewSortOrder(previousArray) {
        const target = this.target;
        const previousOrder = new Array(target.length);
        const lastItemIndices = new Map();
        //	reindex the paths
        for (let i = 0; i < target.length; i += 1) {
            const item = target[i];
            if (item && typeof item === 'object') {
                const observable = item[ObjectObserver.key];
                previousOrder[i] = observable.ownKey;
                // record new ownKey
                observable.ownKey = i;
            }
            else {
                // if primitive, need to progress through the array
                previousOrder[i] = previousArray.indexOf(item, (lastItemIndices.get(item) ?? -1) + 1);
                lastItemIndices.set(item, previousOrder[i]);
            }
        }
        return previousOrder;
    }
    updateArrayIndices() {
        const target = this.target;
        //	reindex the paths
        for (let i = 0; i < target.length; i += 1) {
            const item = target[i];
            const observer = item[ObjectObserver.key];
            if (observer)
                observer.ownKey = i;
        }
    }
    observeChild(item, key) {
        if (!item || typeof item !== 'object')
            return item;
        // A bit heavy handed but since we can't observe these, we just freeze them
        if (Buffer.isBuffer(item) || ArrayBuffer.isView(item) || item instanceof Date) {
            return this.deepClone(item);
        }
        const existing = item[ObjectObserver.key];
        if (existing) {
            existing.ownKey = key;
            existing.parentPath = this.path;
            existing.onChanges = this.onChanges;
            return existing.proxy;
        }
        const observable = new ObjectObserver(item, this.onChanges, key, this.path);
        return observable.proxy;
    }
    coerceKey(key) {
        if (this.isArray && !Number.isInteger(key) && isNumberRegex.test(key)) {
            return parseInt(key, 10);
        }
        return key;
    }
    static create(target, onChanges) {
        const observable = new ObjectObserver(target, onChanges);
        return observable.proxy;
    }
    static isObserved(item) {
        return !!item[ObjectObserver.key];
    }
    static detach(item) {
        if (item && typeof item === 'object') {
            const existing = item[ObjectObserver.key];
            if (existing)
                return existing.detach();
        }
        return item;
    }
}
ObjectObserver.key = Symbol.for('object-observer-key-v0');
exports.default = ObjectObserver;
function Observable(source) {
    const observable = new ObjectObserver(source);
    return observable.proxy;
}
const isNumberRegex = /^\d+$/;
//# sourceMappingURL=ObjectObserver.js.map
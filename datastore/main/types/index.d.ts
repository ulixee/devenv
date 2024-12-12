import IItemInputOutput from '../interfaces/IItemInputOutput';
export default interface ITypes extends Record<string, {
    extractors: Record<string, IItemInputOutput>;
    tables: Record<string, IItemInputOutput>;
}> {
}

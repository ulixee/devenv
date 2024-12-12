export default interface IOutputClass<T> {
    new (data?: T): T & {
        emit(): void;
    };
    emit(data: T): any;
}

import { IAnySchemaJson } from '../interfaces/ISchemaJson';
export default function jsonToSchemaCode(json: Record<string, IAnySchemaJson> | IAnySchemaJson, schemaImports: Set<string>): string;
export declare function getFieldName(str: string): string;

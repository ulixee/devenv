import * as ts from 'typescript';
import { ISchemaAny } from '../index';
export default function schemaToInterface(schema: ISchemaAny | Record<string, ISchemaAny> | Record<string, Record<string, ISchemaAny>>): ts.TypeNode;
export declare function getIdentifierOrStringLiteral(str: string): ts.PropertyName;
export declare function printNode(node: ts.Node, printerOptions?: ts.PrinterOptions): string;

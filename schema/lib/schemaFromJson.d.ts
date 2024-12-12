import { IAnySchemaJson } from '../interfaces/ISchemaJson';
import { ISchemaAny } from '../index';
export default function schemaFromJson(json: Record<string, IAnySchemaJson> | IAnySchemaJson): ISchemaAny;

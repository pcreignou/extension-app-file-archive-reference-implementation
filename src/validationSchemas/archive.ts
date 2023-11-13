import { Schema } from 'express-validator';

export const archiveFileBody: Schema = {
  file: { isObject: true },
  'file.path': { trim: true, isString: true },
  'file.name': { trim: true, isString: true },
  'file.type': { trim: true, isString: true },
  'file.bytes': { trim: true, isString: true },
  'file.length': { isInt: true },
  order: { isInt: true, optional: true },
  overwrite: { isBoolean: true, optional: true },
};

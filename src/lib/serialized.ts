import { Types } from 'mongoose';

export function serializeData(data: any): any {
  if (Array.isArray(data)) {
    return data.map(serializeData);
  }
  if (data !== null && typeof data === 'object') {
    if (data instanceof Types.ObjectId) {
      return data.toString();
    }
    if (data instanceof Date) {
      return data.toISOString();
    }
    const result: { [key: string]: any } = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = serializeData(data[key]);
      }
    }
    return result;
  }
  return data;
}
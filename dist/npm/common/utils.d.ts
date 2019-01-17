import BigNumber from 'bignumber.js';
import { Amount, SunnycoindAmount } from './types/objects';
declare function isValidSecret(secret: string): boolean;
declare function dropsToSun(drops: string | BigNumber): string;
declare function sunToDrops(sun: string | BigNumber): string;
declare function toSunnycoindAmount(amount: Amount): SunnycoindAmount;
declare function convertKeysFromSnakeCaseToCamelCase(obj: any): any;
declare function removeUndefined<T extends object>(obj: T): T;
declare function sunnycoinTimeToISO8601(sunnycoinTime: number): string;
/**
 * @param {string} iso8601 international standard date format
 * @return {number} seconds since sunnycoin epoch (1/1/2000 GMT)
 */
declare function iso8601ToSunnycoinTime(iso8601: string): number;
export { dropsToSun, sunToDrops, toSunnycoindAmount, convertKeysFromSnakeCaseToCamelCase, removeUndefined, sunnycoinTimeToISO8601, iso8601ToSunnycoinTime, isValidSecret };

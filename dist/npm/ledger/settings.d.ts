import { FormattedSettings } from '../common/types/objects';
import { SunnycoinAPI } from '../api';
export declare type SettingsOptions = {
    ledgerVersion?: number;
};
export declare function parseAccountFlags(value: number, options?: {
    excludeFalse?: boolean;
}): {};
export declare function getSettings(this: SunnycoinAPI, address: string, options?: SettingsOptions): Promise<FormattedSettings>;

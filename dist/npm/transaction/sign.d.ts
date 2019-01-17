import { SignOptions, KeyPair } from './types';
import { SunnycoinAPI } from '../api';
declare function sign(this: SunnycoinAPI, txJSON: string, secret?: any, options?: SignOptions, keypair?: KeyPair): {
    signedTransaction: string;
    id: string;
};
export default sign;

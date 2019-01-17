import { FormattedPaymentChannel } from './parse/payment-channel';
import { SunnycoinAPI } from '../api';
declare function getPaymentChannel(this: SunnycoinAPI, id: string): Promise<FormattedPaymentChannel>;
export default getPaymentChannel;

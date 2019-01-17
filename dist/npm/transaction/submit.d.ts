import { SunnycoinAPI } from '..';
export interface FormattedSubmitResponse {
    resultCode: string;
    resultMessage: string;
}
declare function submit(this: SunnycoinAPI, signedTransaction: string): Promise<FormattedSubmitResponse>;
export default submit;

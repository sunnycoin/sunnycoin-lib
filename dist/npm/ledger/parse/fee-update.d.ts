declare function parseFeeUpdate(tx: any): {
    baseFeeSUN: string;
    referenceFeeUnits: any;
    reserveBaseSUN: string;
    reserveIncrementSUN: string;
};
export default parseFeeUpdate;

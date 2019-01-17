"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const common_1 = require("../../common");
function parseFeeUpdate(tx) {
    const baseFeeDrops = (new bignumber_js_1.default(tx.BaseFee, 16)).toString();
    return {
        baseFeeSUN: common_1.dropsToSun(baseFeeDrops),
        referenceFeeUnits: tx.ReferenceFeeUnits,
        reserveBaseSUN: common_1.dropsToSun(tx.ReserveBase),
        reserveIncrementSUN: common_1.dropsToSun(tx.ReserveIncrement)
    };
}
exports.default = parseFeeUpdate;
//# sourceMappingURL=fee-update.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common = require("../../common");
function parseAmount(amount) {
    if (typeof amount === 'string') {
        return {
            currency: 'SUN',
            value: common.dropsToSun(amount)
        };
    }
    return {
        currency: amount.currency,
        value: amount.value,
        counterparty: amount.issuer
    };
}
exports.default = parseAmount;
//# sourceMappingURL=amount.js.map
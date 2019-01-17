"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const browserHacks = require("./browser-hacks");
class SunnycoinError extends Error {
    constructor(message = '', data) {
        super(message);
        this.name = browserHacks.getConstructorName(this);
        this.message = message;
        this.data = data;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    toString() {
        let result = '[' + this.name + '(' + this.message;
        if (this.data) {
            result += ', ' + util_1.inspect(this.data);
        }
        result += ')]';
        return result;
    }
    /* console.log in node uses util.inspect on object, and util.inspect allows
    us to customize its output:
    https://nodejs.org/api/util.html#util_custom_inspect_function_on_objects */
    inspect() {
        return this.toString();
    }
}
exports.SunnycoinError = SunnycoinError;
class SunnycoindError extends SunnycoinError {
}
exports.SunnycoindError = SunnycoindError;
class UnexpectedError extends SunnycoinError {
}
exports.UnexpectedError = UnexpectedError;
class LedgerVersionError extends SunnycoinError {
}
exports.LedgerVersionError = LedgerVersionError;
class ConnectionError extends SunnycoinError {
}
exports.ConnectionError = ConnectionError;
class NotConnectedError extends ConnectionError {
}
exports.NotConnectedError = NotConnectedError;
class DisconnectedError extends ConnectionError {
}
exports.DisconnectedError = DisconnectedError;
class SunnycoindNotInitializedError extends ConnectionError {
}
exports.SunnycoindNotInitializedError = SunnycoindNotInitializedError;
class TimeoutError extends ConnectionError {
}
exports.TimeoutError = TimeoutError;
class ResponseFormatError extends ConnectionError {
}
exports.ResponseFormatError = ResponseFormatError;
class ValidationError extends SunnycoinError {
}
exports.ValidationError = ValidationError;
class NotFoundError extends SunnycoinError {
    constructor(message = 'Not found') {
        super(message);
    }
}
exports.NotFoundError = NotFoundError;
class MissingLedgerHistoryError extends SunnycoinError {
    constructor(message) {
        super(message || 'Server is missing ledger history in the specified range');
    }
}
exports.MissingLedgerHistoryError = MissingLedgerHistoryError;
class PendingLedgerVersionError extends SunnycoinError {
    constructor(message) {
        super(message || 'maxLedgerVersion is greater than server\'s most recent' +
            ' validated ledger');
    }
}
exports.PendingLedgerVersionError = PendingLedgerVersionError;
//# sourceMappingURL=errors.js.map
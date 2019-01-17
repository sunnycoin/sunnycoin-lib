declare class SunnycoinError extends Error {
    name: string;
    message: string;
    data?: any;
    constructor(message?: string, data?: any);
    toString(): string;
    inspect(): string;
}
declare class SunnycoindError extends SunnycoinError {
}
declare class UnexpectedError extends SunnycoinError {
}
declare class LedgerVersionError extends SunnycoinError {
}
declare class ConnectionError extends SunnycoinError {
}
declare class NotConnectedError extends ConnectionError {
}
declare class DisconnectedError extends ConnectionError {
}
declare class SunnycoindNotInitializedError extends ConnectionError {
}
declare class TimeoutError extends ConnectionError {
}
declare class ResponseFormatError extends ConnectionError {
}
declare class ValidationError extends SunnycoinError {
}
declare class NotFoundError extends SunnycoinError {
    constructor(message?: string);
}
declare class MissingLedgerHistoryError extends SunnycoinError {
    constructor(message?: string);
}
declare class PendingLedgerVersionError extends SunnycoinError {
    constructor(message?: string);
}
export { SunnycoinError, UnexpectedError, ConnectionError, SunnycoindError, NotConnectedError, DisconnectedError, SunnycoindNotInitializedError, TimeoutError, ResponseFormatError, ValidationError, NotFoundError, PendingLedgerVersionError, MissingLedgerHistoryError, LedgerVersionError };

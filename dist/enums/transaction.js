"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSACTION_STATUS = void 0;
var TRANSACTION_STATUS;
(function (TRANSACTION_STATUS) {
    TRANSACTION_STATUS[TRANSACTION_STATUS["Pending"] = 0] = "Pending";
    TRANSACTION_STATUS[TRANSACTION_STATUS["Completed"] = 1] = "Completed";
    TRANSACTION_STATUS[TRANSACTION_STATUS["Failed"] = 2] = "Failed";
})(TRANSACTION_STATUS || (exports.TRANSACTION_STATUS = TRANSACTION_STATUS = {}));

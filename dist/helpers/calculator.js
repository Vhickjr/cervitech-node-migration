"use strict";
// helpers/Calculator.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calculator = void 0;
class Calculator {
    static getCraniumVertebralAngleFromNeckAngle(neckAngle) {
        try {
            let craniumVertebralAngle = neckAngle - 40;
            if (craniumVertebralAngle < 0) {
                craniumVertebralAngle = 0;
            }
            return craniumVertebralAngle;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.Calculator = Calculator;

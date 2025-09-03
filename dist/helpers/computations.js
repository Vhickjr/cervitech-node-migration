"use strict";
// helpers/computations/calculator.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCraniumVertebralAngleFromNeckAngle = getCraniumVertebralAngleFromNeckAngle;
function getCraniumVertebralAngleFromNeckAngle(neckAngle) {
    let craniumVertebralAngle = neckAngle - 40;
    if (craniumVertebralAngle < 0) {
        craniumVertebralAngle = 0;
    }
    return craniumVertebralAngle;
}

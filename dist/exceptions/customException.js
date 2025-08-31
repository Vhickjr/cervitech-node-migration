// exceptions/CustomException.ts
export default class CustomException extends Error {
    constructor(message) {
        super(message);
        this.name = 'CustomException';
        // For correct prototype chain
        Object.setPrototypeOf(this, CustomException.prototype);
    }
}

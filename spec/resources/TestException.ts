export class TestException extends Error {
    constructor(errors: Array<{ label: string, code: string }>) {
        super()
        Object.setPrototypeOf(this, TestException.prototype)
    }
}

# iris-common-test-utils
> Javascript test utils for IRIS

## Usage
To use iris-common-test-utils in your tests, you need to add the type `@u-iris/iris-common-test-utils` in your tsconfig.json :
```json
{
    "types": [
        "jest",
        "@u-iris/iris-common-test-utils/jest.extend"
    ]
}
```

Then if you want to use jest specific matchers, import `@u-iris/iris-common-test-utils` at the top of your test file :
```js
import '@u-iris/iris-common-test-utils'

describe('my test', () => {
  // ...
})

```

## Unit Test Helpers

Severals utils functions for unit tests are available :
```typescript
/**
     * Function calling an async function with arguments and checking than its result is correct
     * @param {*} functionToCall
     * @param {*} expectedResult
     * @param  {...any} functionArgs
     */
    static callFunctionAndCheckResult<R>(functionToCall: (...args: any[]) => Promise<R>, expectedResult: R, ...functionArgs: Parameters<typeof functionToCall>): Promise<void>;

    /**
     * Function checking if a given function has been called with given params as arguments
     * @param {function} functionToHaveBeenCalled
     * @param  {...any} functionArgs
     */
    static checkFunctionCall<T extends (...args: any[]) => any>(functionToHaveBeenCalled: T, ...functionArgs: Parameters<T>): void;

    /**
     * Check that an IrisException contains some errors.
     * @param exception - the IrisException
     * @param errors - errors like
     */
    static expectExceptionToContain(exception: IrisException, ...errors: Array<{
        field?: string;
        code?: string;
        label?: string;
        limit?: number;
        value?: any;
        path?: Array<string | number>;
    }>): void;

    /**
     * Check that a function throws an IrisException by checking the exception type and the errors contained into the exception.
     * @param fct - the function to call
     * @param exceptionType - a subclass of IrisException
     * @param errors - the errors
     */
    static expectThrowIrisExceptionLike<T extends IrisException>(fct: (...args: any[]) => any, exceptionType: new (...args: any[]) => T, ...errors: Array<{
        field?: string;
        code?: string;
        label?: string;
        limit?: number;
        value?: any;
        path?: Array<string | number>;
    }>): Promise<void>;

    /**
     * Function checking that an exception is thrown when an async function is called
     * @param {*} exceptionClass, constructor of the thrown exception
     * @param {array} errors, exhaustive array of the error erreurs thrown in exception
     * @param {function} functionToTest, function to call
     * @param  {...any} functionArgs, arguments of the function to call
     * @deprecated use expectThrowIrisExceptionLike instead
     */
    static checkException<T extends IrisException, F extends (...args: any[]) => any>(exceptionClass: new (...args: any[]) => T, errors: IErrorChecked[], functionToTest: F, ...functionArgs: Parameters<F>): Promise<void>;

    /**
     * Function creating an object of mocked functions (for ex., used to mock models or dao in node projects)
     * @param {*} functionsToMock (array of objects like { path: 'function.path.inFinalObject', value: returnedValueOfTheMock })
     */
    static initMocks(functionsToMock: Array<{
        path: string;
        value: any;
    }>): {}; 
```

## Changelog
see [CHANGELOG.md](CHANGELOG.md)


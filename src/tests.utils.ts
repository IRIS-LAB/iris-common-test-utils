import {ErreurDO, IrisException} from '@u-iris/iris-common'
import {set as _set} from 'lodash'
import {Omit} from 'yargs'

// tslint:disable-next-line:no-var-requires
require('./jest/jest.extends')

/**
 * Function calling an async function with arguments and checking than its result is correct
 * @param {*} functionToCall
 * @param {*} expectedResult
 * @param  {...any} functionArgs
 */
export async function callFunctionAndCheckResult<R>(
    functionToCall: (...args: any[]) => Promise<R>,
    expectedResult: R,
    ...functionArgs: Parameters<typeof functionToCall>
): Promise<void> {
    const result = await functionToCall.apply(null, functionArgs)
    expect(result).toEqual(expectedResult)
}

/**
 * Function checking if a given function has been called with given params as arguments
 * @param {function} functionToHaveBeenCalled
 * @param  {...any} functionArgs
 */
// tslint:disable-next-line:ban-types
export function checkFunctionCall(functionToHaveBeenCalled: Function, ...functionArgs: any[]) {
    expect(functionToHaveBeenCalled).toHaveBeenCalledTimes(1)
    expect(functionToHaveBeenCalled).toHaveBeenCalledWith(...functionArgs)
}

type IErrorChecked = Omit<ErreurDO, 'libelleErreur'> & {
    libelleErreur?: string
}

/**
 * Function checking that an exception is thrown when an async function is called
 * @param {*} exceptionClass, constructor of the thrown exception
 * @param {array} errors, exhaustive array of the error erreurs thrown in exception
 * @param {function} functionToTest, function to call
 * @param  {...any} functionArgs, arguments of the function to call
 */
export async function checkException<T extends IrisException>(
    exceptionClass: new (...args: any[]) => T,
    errors: IErrorChecked[],
    functionToTest: (...args: any[]) => any,
    ...functionArgs: Parameters<typeof functionToTest>
): Promise<void> {
    // tslint:disable-next-line:no-console
    console.log("expect %s", exceptionClass.prototype.constructor.name)
    // WHEN
    let result = null
    try {
        const r = functionToTest.apply(null, functionArgs)
        if (r instanceof Promise) {
            await r
        }

    } catch (e) {
        // checking exception throwed within async function
        result = e
    }
    // THEN
    // Check exception class
    expect(result).toBeDefined()
    expect(result).toBeInstanceOf(exceptionClass)

    const exception = result as T

    // Check that each given errorCode is present in the result
    // for (const errorThrown of exception.erreurs) {
    //     expect(erreurs).toContainObjectLike({champErreur: errorThrown.champErreur, codeErreur: errorThrown.codeErreur})
    //     const expectedErrorFound = erreurs.find(e => e.champErreur === errorThrown.champErreur && e.codeErreur === errorThrown.codeErreur)
    //     expect(expectedErrorFound).toBeDefined()
    //     if (expectedErrorFound && expectedErrorFound.libelleErreur) {
    //         expect(errorThrown.libelleErreur).toEqual(expectedErrorFound.libelleErreur)
    //     }
    // }
    for (const expectedError of errors) {
        const {champErreur, codeErreur} = expectedError
        expect(exception.erreurs).toContainObjectLike({champErreur, codeErreur})
        const errorThrown = exception.erreurs.find(e => e.champErreur === expectedError.champErreur && e.codeErreur === expectedError.codeErreur)
        expect(errorThrown).toBeDefined()
        if (errorThrown && expectedError.libelleErreur) {
            expect(errorThrown.libelleErreur).toEqual(expectedError.libelleErreur)
        }
    }
    // Check that there is no other errorCode
    expect(exception.erreurs).toHaveLength(errors.length)
}

/**
 * Function creating an object of mocked functions (for ex., used to mock models or dao in node projects)
 * @param {*} functionsToMock (array of objects like { path: 'function.path.inFinalObject', value: returnedValueOfTheMock })
 */
export function initMocks(functionsToMock: Array<{ path: string, value: any }>) {
    const mocksObject = {}
    functionsToMock.forEach(functionToMock => {
        _set(mocksObject, functionToMock.path, jest.fn(() => functionToMock.value))
    })
    return mocksObject
}

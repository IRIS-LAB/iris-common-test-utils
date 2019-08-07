import { ErrorDO, IrisException } from '@u-iris/iris-common'
import { set as _set } from 'lodash'

// tslint:disable-next-line:no-var-requires
require('../jest/jest.extends')

interface IErrorChecked {
  code?: ErrorDO['code']
  field?: ErrorDO['field']
  label?: ErrorDO['label']
  path?: ErrorDO['path']
  value?: ErrorDO['value']
  limit?: ErrorDO['limit']
  [key: string]: any
}

export class TestsUtils {
  /**
   * Function calling an async function with arguments and checking than its result is correct
   * @param {*} functionToCall
   * @param {*} expectedResult
   * @param  {...any} functionArgs
   */
  public static async callFunctionAndCheckResult<R>(
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
  public static checkFunctionCall<T extends (...args: any[]) => any>(functionToHaveBeenCalled: T, ...functionArgs: Parameters<T>) {
    expect(functionToHaveBeenCalled).toHaveBeenCalledTimes(1)
    expect(functionToHaveBeenCalled).toHaveBeenCalledWith(...functionArgs)
  }


  /**
   * Function checking that an exception is thrown when an async function is called
   * @param {*} exceptionClass, constructor of the thrown exception
   * @param {array} errors, exhaustive array of the error erreurs thrown in exception
   * @param {function} functionToTest, function to call
   * @param  {...any} functionArgs, arguments of the function to call
   */
  public static async checkException<T extends IrisException, F extends (...args: any[]) => any>(exceptionClass: new (...args: any[]) => T, errors: IErrorChecked[], functionToTest: F, ...functionArgs: Parameters<F>
  ): Promise<void> {
    // tslint:disable-next-line:no-console
    console.log('expect %s', exceptionClass.prototype.constructor.name)
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
      const { field, code } = expectedError
      expect(exception.errors).toContainObjectLike({ field, code })
      const errorThrown = exception.errors.find(e => e.field === expectedError.field && e.code === expectedError.code)
      expect(errorThrown).toBeDefined()
      if (errorThrown && expectedError.label) {
        expect(errorThrown.label).toEqual(expectedError.label)
      }
    }
    // Check that there is no other errorCode
    expect(exception.errors).toHaveLength(errors.length)
  }

  /**
   * Function creating an object of mocked functions (for ex., used to mock models or dao in node projects)
   * @param {*} functionsToMock (array of objects like { path: 'function.path.inFinalObject', value: returnedValueOfTheMock })
   */
  public static initMocks(functionsToMock: Array<{ path: string, value: any }>) {
    const mocksObject = {}
    functionsToMock.forEach(functionToMock => {
      _set(mocksObject, functionToMock.path, jest.fn(() => functionToMock.value))
    })
    return mocksObject
  }

}

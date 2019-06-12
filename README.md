# iris-common-test-utils
> Javascript test utils for IRIS

## Usage
To use iris-common-test-utils in your tests, you need to add the type _@u-iris/iris-common-test-utils_ in your tsconfig.json :
```json
{
    // ...
    "types": [
        "jest",
        "@u-iris/iris-common-test-utils"
        //...
    ],
    // ...
}
```

Then if you want to use jest specific matchers, import _@u-iris/iris-common-test-utils_ at the top of your test file :
```js
import '@u-iris/iris-common-test-utils'

describe('my test', () => {
  // ...
})

```

## Unit Test Helpers

Severals utils functions for unit tests are available :

- **callFunctionAndCheckResult**: function calling an async function with arguments and checking than its result is correct.  
  _`async function callFunctionAndCheckResult(functionToCall, expectedResult, ...functionArgs)`_

- **checkFunctionCall**: function checking if a given function has been called exactly one time, with given params as arguments.  
  _`function checkFunctionCall(functionToHaveBeenCalled, ...functionArgs)`_

- **checkException**: function checking that an exception is thrown when an async function is called.  
  Its arguments are the constructor of the thrown exception, an exhaustive array of the error codes thrown in exception, the function to call, and the arguments of the function to call.  
  _`async function checkException(exceptionClass, errorCodes, functionToTest, ...functionArgs)`_

- **initMocks**: function creating an object of mocked functions (for ex., used to mock models or dao in node projects).  
  Its argument should be an array of objects like `{ path: 'function.path.inFinalObject', value: returnedValueOfTheMock }`.  
  _`function initMocks(functionsToMock)`_

```js
import { checkFunctionCall } from '@u-iris/iris-common'
import { functionOne } from 'moduleToTest' // function taking two parameters
describe('functionOne', () => {
    it('should call functionTwo with arguments "toto" and "test", and return "tototest", when called with the parameter "toto" and "test"', async () => {
        const functionTwo = jest.fn()
        await callFunctionAndCheckResult(functionOne, "tototest", "toto", "test")
        checkFunctionCall(functionTwo, "toto", "test")
    })
})
```

## Changelog
| Version | Comment |
|---|---|
| 1.0.1 | <ul><li>export jest matchers typings</li><li>improve documentation</li></ul> |
| 1.0.0 | <ul><li>Initial version</li></ul> |


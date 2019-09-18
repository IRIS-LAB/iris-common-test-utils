import {
  BusinessException,
  EntityNotFoundBusinessException,
  SecurityException,
  TechnicalException,
  ErrorDO
} from '@u-iris/iris-common'
import { TestsUtils } from '../../src'

describe('TestUtils', () => {
  describe('test', () => {
    it('should throw exception', () => {
      expect(BusinessException).toBeDefined()
    })
  })
  describe('checkFunctionCall', () => {
    it('should return success', () => {
      const module = {
        fct: (type: string, count: number) => {
          return type + ' ' + count
        }
      }
      jest.spyOn(module, 'fct').mockImplementation(() => 'cool')
      module.fct('example', 5)
      TestsUtils.checkFunctionCall(module.fct, 'example', 5)
    })
    it('should return error', () => {
      const module = {
        fct: (type: string, name: number) => {
          return type + ' ' + name
        }
      }
      jest.spyOn(module, 'fct').mockImplementation(() => 'cool')
      module.fct('example', 5)
      try {
        TestsUtils.checkFunctionCall(module.fct, 'baD param', 5)
        expect(false).toBeTruthy()
      } catch (e) {
        expect(e).toBeDefined()
      }
    })
  })
  describe('callFunctionAndCheckResult', () => {
    it('should return success', async () => {
      const module = {
        fct: async (type: string, name: number) => {
          return type + ' ' + name
        }
      }
      // jest.spyOn(module, 'fct').mockImplementation(() => 'cool')
      module.fct('example', 5)
      await TestsUtils.callFunctionAndCheckResult(
        module.fct,
        'example 5',
        'example',
        5
      )
    })
    it('should return error', async () => {
      const module = {
        fct: async (type: string, name: number) => {
          return type + ' ' + name
        }
      }
      // jest.spyOn(module, 'fct').mockImplementation(() => 'cool')
      module.fct('example', 5)
      try {
        await TestsUtils.callFunctionAndCheckResult(
          module.fct,
          'example5',
          'example',
          5
        )
        expect(false).toBeTruthy()
      } catch (e) {
        expect(e).toBeDefined()
      }
    })
  })

  describe('checkException', () => {
    it('should valid exception code and error erreurs', async () => {
      const module = {
        fct: async () => {
          throw new BusinessException([
            { field: 'field', code: 'required', label: 'field is required' }
          ])
        }
      }
      await TestsUtils.checkException(
        BusinessException,
        [{ field: 'field', code: 'required' }],
        module.fct
      )
    })

    it('should valid exception for children of BusinessException', async () => {
      const module = {
        fct: async () => {
          throw new EntityNotFoundBusinessException({
            field: 'field',
            code: 'required',
            label: 'field is required'
          })
        }
      }
      await TestsUtils.checkException(
        EntityNotFoundBusinessException,
        [
          {
            field: 'field',
            code: 'required'
          }
        ],
        module.fct
      )
    })
    it('should valid exception for children of SecurityException', async () => {
      const module = {
        fct: async () => {
          throw new SecurityException([
            { field: 'field', code: 'required', label: 'field is required' }
          ])
        }
      }
      await TestsUtils.checkException(
        SecurityException,
        [{ field: 'field', code: 'required' }],
        module.fct
      )
    })
    it('should reject bad exception code', async () => {
      const module = {
        fct: async () => {
          throw new BusinessException([
            {
              field: 'field',
              code: 'field.required',
              label: 'field is required'
            }
          ])
        }
      }
      try {
        await TestsUtils.checkException(
          TechnicalException,
          [{ field: 'field', code: 'required' }],
          module.fct
        )
        expect(false).toBeTruthy()
      } catch (e) {
        expect(e).toBeDefined()
      }
    })
    it('should reject bad error code', async () => {
      const module = {
        fct: async () => {
          throw new BusinessException([
            {
              field: 'field',
              code: 'field.required',
              label: 'field is required'
            }
          ])
        }
      }
      try {
        await TestsUtils.checkException(
          BusinessException,
          [{ field: 'otherfield', code: 'required' }],
          module.fct
        )
        expect(false).toBeTruthy()
      } catch (e) {
        expect(e).toBeDefined()
      }
    })
    it('should reject multiple bad error code for method async', async () => {
      const module = {
        fct: async () => {
          throw new BusinessException([
            { field: 'field', code: 'required', label: 'field is required' },
            { field: 'field2', code: 'string.max', label: 'field2 is max' }
          ])
        }
      }
      try {
        await TestsUtils.checkException(
          BusinessException,
          [
            { field: 'field', code: 'required' },
            { field: 'field2', code: 'string.max' }
          ],
          module.fct
        )
        expect(false).toBeTruthy()
      } catch (e) {
        expect(e).toBeDefined()
      }
    })
    it('should reject multiple bad error code for method sync', async () => {
      const module = {
        fct: () => {
          throw new BusinessException([
            { field: 'field', code: 'required', label: 'field is required' },
            { field: 'field2', code: 'string.max', label: 'field2 is max' }
          ])
        }
      }
      try {
        await TestsUtils.checkException(
          BusinessException,
          [
            { field: 'field', code: 'required' },
            { field: 'field2', code: 'string.max' }
          ],
          module.fct
        )
        expect(false).toBeTruthy()
      } catch (e) {
        expect(e).toBeDefined()
      }
    })
  })

  describe('executeAction', () => {
    let exceptionThrown = true
    const actionPayload = 1
    const mutationPayload = 2
    const action = {
      fct: (context: any, type: string) => {}
    }
    const actionDispatchCommit = {
      fct: (context: any, type: string) => {
        context.dispatch('monAction', actionPayload)
        context.commit('maMutation', mutationPayload)
      }
    }
    const actionDispatchCommitException = {
      fct: (context: any, type: string) => {
        context.dispatch('monAction')
        context.commit('maMutation')
        throw new BusinessException(
          new ErrorDO('test field', 'test code', 'test label')
        )
      }
    }

    it('should return success (with dispatch and commit)', async () => {
      const done = { fct: () => {} }
      jest.spyOn(done, 'fct').mockImplementation(() => 'cool')
      await TestsUtils.executeAction({
        action: actionDispatchCommit.fct,
        expectedActions: [{ type: 'monAction', payload: actionPayload }],
        expectedMutations: [{ type: 'maMutation', payload: 2 }],
        done: done.fct
      })

      expect(done.fct).toHaveBeenCalledTimes(1)
    })

    it('should return success (with dispatch, commit and exception)', async () => {
      const done = { fct: () => {} }
      jest.spyOn(done, 'fct').mockImplementation(() => 'cool')
      await TestsUtils.executeAction({
        action: actionDispatchCommitException.fct,
        expectedActions: [{ type: 'monAction' }],
        expectedMutations: [{ type: 'maMutation' }],
        expectedException: BusinessException,
        done: done.fct
      })

      expect(done.fct).toHaveBeenCalledTimes(1)
    })

    it('should return error (wrong expected action)', async () => {
      try {
        await TestsUtils.executeAction({
          action: action.fct,
          expectedActions: [{ type: 'monAction' }, { type: 'blabla' }],
          expectedMutations: [{ type: 'maMutation' }]
        })
        exceptionThrown = false
      } catch (e) {
        expect(e).toBeDefined()
      }
      expect(exceptionThrown, 'Did not throw the expected exception').toBe(true)
    })

    it('should return error (wrong expected mutation)', async () => {
      try {
        await TestsUtils.executeAction({
          action: action.fct,
          expectedActions: [{ type: 'monAction' }],
          expectedMutations: [{ type: 'maMutation' }, { type: 'blabla' }]
        })
        exceptionThrown = false
      } catch (e) {
        expect(e).toBeDefined()
      }
      expect(exceptionThrown, 'Did not throw the expected exception').toBe(true)
    })

    it('should return error (missing expected action)', async () => {
      try {
        await TestsUtils.executeAction({
          action: action.fct,
          expectedMutations: [{ type: 'maMutation' }]
        })
        exceptionThrown = false
      } catch (e) {
        expect(e).toBeDefined()
      }
      expect(exceptionThrown, 'Did not throw the expected exception').toBe(true)
    })

    it('should return error (missing expected mutation)', async () => {
      try {
        await TestsUtils.executeAction({
          action: action.fct,
          expectedActions: [{ type: 'monAction' }]
        })
        exceptionThrown = false
      } catch (e) {
        expect(e).toBeDefined()
      }
      expect(exceptionThrown, 'Did not throw the expected exception').toBe(true)
    })

    it('should return error (missing expected exception)', async () => {
      try {
        await TestsUtils.executeAction({
          action: action.fct,
          expectedActions: [{ type: 'monAction' }],
          expectedMutations: [{ type: 'maMutation' }],
          expectedException: BusinessException
        })
        exceptionThrown = false
      } catch (e) {
        expect(e).toBeDefined()
      }
      expect(exceptionThrown, 'Did not throw the expected exception').toBe(true)
    })

    it('should return error (wring mutation payload)', async () => {
      try {
        await TestsUtils.executeAction({
          action: actionDispatchCommit.fct,
          expectedActions: [{ type: 'monAction', payload: actionPayload }],
          expectedMutations: [{ type: 'maMutation' }]
        })
        exceptionThrown = false
      } catch (e) {
        expect(e).toBeDefined()
      }
      expect(exceptionThrown, 'Did not throw the expected exception').toBe(true)
    })

    it('should return error (wring mutation payload)', async () => {
      try {
        await TestsUtils.executeAction({
          action: actionDispatchCommit.fct,
          expectedActions: [{ type: 'monAction' }],
          expectedMutations: [{ type: 'maMutation', payload: mutationPayload }]
        })
        exceptionThrown = false
      } catch (e) {
        expect(e).toBeDefined()
      }
      expect(exceptionThrown, 'Did not throw the expected exception').toBe(true)
    })
  })
})

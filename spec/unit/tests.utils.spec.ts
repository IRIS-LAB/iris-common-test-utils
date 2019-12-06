import {
  BusinessException,
  EntityNotFoundBusinessException,
  SecurityException,
  TechnicalException
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
          return (type + ' ' + name)
        }
      }
      // jest.spyOn(module, 'fct').mockImplementation(() => 'cool')
      module.fct('example', 5)
      await TestsUtils.callFunctionAndCheckResult(module.fct, 'example 5', 'example', 5)
    })
    it('should return error', async () => {
      const module = {
        fct: async (type: string, name: number) => {
          return (type + ' ' + name)
        }
      }
      // jest.spyOn(module, 'fct').mockImplementation(() => 'cool')
      module.fct('example', 5)
      try {
        await TestsUtils.callFunctionAndCheckResult(module.fct, 'example5', 'example', 5)
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
          throw new BusinessException([{ field: 'field', code: 'required', label: 'field is required' }])
        }
      }
      await TestsUtils.checkException(BusinessException, [{ field: 'field', code: 'required' }], module.fct)
    })

    it('should valid exception for children of BusinessException', async () => {
      const module = {
        fct: async () => {
          throw new EntityNotFoundBusinessException({ field: 'field', code: 'required', label: 'field is required' })
        }
      }
      await TestsUtils.checkException(EntityNotFoundBusinessException, [{
        field: 'field',
        code: 'required'
      }], module.fct)
    })
    it('should valid exception for children of SecurityException', async () => {
      const module = {
        fct: async () => {
          throw new SecurityException([{ field: 'field', code: 'required', label: 'field is required' }])
        }
      }
      await TestsUtils.checkException(SecurityException, [{ field: 'field', code: 'required' }], module.fct)
    })
    it('should reject bad exception code', async () => {
      const module = {
        fct: async () => {
          throw new BusinessException([{ field: 'field', code: 'field.required', label: 'field is required' }])
        }
      }
      try {
        await TestsUtils.checkException(TechnicalException, [{ field: 'field', code: 'required' }], module.fct)
        expect(false).toBeTruthy()
      } catch (e) {
        expect(e).toBeDefined()
      }
    })
    it('should reject bad error code', async () => {
      const module = {
        fct: async () => {
          throw new BusinessException([{ field: 'field', code: 'field.required', label: 'field is required' }])
        }
      }
      try {
        await TestsUtils.checkException(BusinessException, [{ field: 'otherfield', code: 'required' }], module.fct)
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
            { field: 'field2', code: 'string.max', label: 'field2 is max' }])
        }
      }
      try {
        await TestsUtils.checkException(BusinessException, [
          { field: 'field', code: 'required' },
          { field: 'field2', code: 'string.max' }
        ], module.fct)
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
            { field: 'field2', code: 'string.max', label: 'field2 is max' }])
        }
      }
      try {
        await TestsUtils.checkException(BusinessException, [
          { field: 'field', code: 'required' },
          { field: 'field2', code: 'string.max' }
        ], module.fct)
        expect(false).toBeTruthy()
      } catch (e) {
        expect(e).toBeDefined()
      }
    })
  })

  describe('expectThrowIrisExceptionLike', () => {
    it('should valid exception code and error erreurs', async () => {
      await TestsUtils.expectThrowIrisExceptionLike(
        () => {
          throw new BusinessException([{ field: 'field', code: 'required', label: 'field is required' }])
        },
        BusinessException,
        { field: 'field', code: 'required' })
    })

    it('should valid exception for children of BusinessException', async () => {
      await TestsUtils.expectThrowIrisExceptionLike(async () => {
          throw new EntityNotFoundBusinessException({ field: 'field', code: 'required', label: 'field is required' })
        },
        EntityNotFoundBusinessException, {
          field: 'field',
          code: 'required'
        })
    })
    it('should valid exception for children of SecurityException', async () => {
      await TestsUtils.expectThrowIrisExceptionLike(
        async () => {
          throw new SecurityException([{ field: 'field', code: 'required', label: 'field is required' }])
        },
        SecurityException, { field: 'field', code: 'required' })
    })
    it('should reject bad exception code', async () => {
      try {
        await TestsUtils.expectThrowIrisExceptionLike(
          async () => {
            throw new BusinessException([{ field: 'field', code: 'field.required', label: 'field is required' }])
          },
          TechnicalException,
          { field: 'field', code: 'required' })
        expect(false).toBeTruthy()
      } catch (e) {
        expect(e).toBeDefined()
      }
    })
    it('should reject bad error code', async () => {
      try {
        await TestsUtils.expectThrowIrisExceptionLike(
          async () => {
            throw new BusinessException([{ field: 'field', code: 'field.required', label: 'field is required' }])
          },
          BusinessException, { field: 'otherfield', code: 'required' })
        expect(false).toBeTruthy()
      } catch (e) {
        expect(e).toBeDefined()
      }
    })
    it('should reject multiple bad error code for method async', async () => {
      try {
        await TestsUtils.expectThrowIrisExceptionLike(
          async () => {
            throw new BusinessException([
              { field: 'field', code: 'required', label: 'field is required' },
              { field: 'field2', code: 'string.max', label: 'field2 is max' }])
          },
          BusinessException,
          { field: 'field', code: 'required' },
          { field: 'field2', code: 'string.max' })

        expect(false).toBeTruthy()
      } catch (e) {
        expect(e).toBeDefined()
      }
    })
    it('should reject multiple bad error code for method sync', async () => {
      try {
        await TestsUtils.expectThrowIrisExceptionLike(
          () => {
            throw new BusinessException([
              { field: 'field', code: 'required', label: 'field is required' },
              { field: 'field2', code: 'string.max', label: 'field2 is max' }])
          },
          BusinessException,
          { field: 'field', code: 'required' },
          { field: 'field2', code: 'string.max' })
        expect(false).toBeTruthy()
      } catch (e) {
        expect(e).toBeDefined()
      }
    })
  })
})

import { mount } from '@vue/test-utils'
import { sizeProps, useSizeClasses } from '../size'

describe('size', () => {
  it('should warn if value is incorrect', () => {
    const TestComponent = {
      props: sizeProps(),
      template: '<div/>',
    }

    mount(TestComponent, {
      props: {
        // @ts-ignore
        size: 'foo',
      },
    })

    expect('[Vue warn]: Invalid prop: custom validator check failed for prop "size".').toHaveBeenTipped()
  })

  it.each([
    [undefined, {}],
    [null, {}],
    [0 as any, {}],
    ['' as any, {}],
    [{ size: undefined }, {}],
    [{ size: 'x-small' }, { 'v-size--x-small': true }],
    [{ size: 'small' }, { 'v-size--small': true }],
    [{ size: 'default' }, { 'v-size--default': true }],
    [{ size: 'large' }, { 'v-size--large': true }],
    [{ size: 'x-large' }, { 'v-size--x-large': true }],
  ])('should have the correct class', (input, expected) => {
    const { sizeClasses } = useSizeClasses(input)

    expect(sizeClasses.value).toStrictEqual(expected)
  })
})

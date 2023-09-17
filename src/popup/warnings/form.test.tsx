import React from 'react'
import browser from 'webextension-polyfill'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WarningForm from './form'
import { WarningStyle, type Warning } from '../../warnings'

const browserMock = jest.mocked(browser)
jest.mock('webextension-polyfill', () => ({
  tabs: {
    query: jest.fn(),
  },
}))

beforeEach(() => {
  browserMock.tabs.query.mockImplementation(async () => [])
})

describe('suggested pattern', () => {
  for (const style of Object.values(WarningStyle)) {
    describe(`when style=${style}`, () => {
      test('suggests pattern based on the current tab', async () => {
        browserMock.tabs.query.mockImplementation(async () => [
          {
            url: 'https://dotboris.io/stuff',
            index: 0,
            active: true,
            highlighted: false,
            incognito: false,
            pinned: false,
          },
        ])

        render(<WarningForm />)
        await userEvent.selectOptions(screen.getByLabelText('Style:'), [style])

        expect(
          screen.getByLabelText<HTMLInputElement>('URL Regex:').value,
        ).toBe('dotboris\\.io')
      })
    })
  }
})

describe('border form', () => {
  test('submit defaults', async () => {
    let res: Warning | undefined

    render(
      <WarningForm
        onSave={(newValue) => {
          res = newValue
        }}
        value={undefined}
      />,
    )

    await userEvent.type(screen.getByLabelText('URL Regex:'), 'url pattern')
    await userEvent.selectOptions(screen.getByLabelText('Style:'), ['border'])
    await userEvent.click(screen.getByText('Save'))

    expect(res).toEqual({
      warningStyle: 'border',
      pattern: 'url pattern',
      borderColor: 'FF0000',
    })
  })

  test('submit existing unchanged', async () => {
    let res: Warning | undefined

    render(
      <WarningForm
        onSave={(newValue) => {
          res = newValue
        }}
        value={{
          warningStyle: 'border',
          pattern: 'existing pattern',
          borderColor: '012',
        }}
      />,
    )

    await userEvent.click(screen.getByText('Save'))

    expect(res).toEqual({
      warningStyle: 'border',
      pattern: 'existing pattern',
      borderColor: '012',
    })
  })

  test('submit new fully changed', async () => {
    let res: Warning | undefined

    render(
      <WarningForm
        onSave={(newValue) => {
          res = newValue
        }}
        value={undefined}
      />,
    )

    await userEvent.type(screen.getByLabelText('URL Regex:'), 'url pattern')
    await userEvent.selectOptions(screen.getByLabelText('Style:'), ['border'])
    await userEvent.clear(screen.getByLabelText('Border Color:'))
    await userEvent.type(screen.getByLabelText('Border Color:'), '00FF00')
    await userEvent.click(screen.getByText('Save'))

    expect(res).toEqual({
      warningStyle: 'border',
      pattern: 'url pattern',
      borderColor: '00FF00',
    })
  })
})

for (const [title, style] of Object.entries({
  'top banner form': 'topBanner',
  'bottom banner form': 'bottomBanner',
} as const)) {
  describe(title, () => {
    test('submit defaults', async () => {
      let res: Warning | undefined

      render(
        <WarningForm
          onSave={(newValue) => {
            res = newValue
          }}
          value={undefined}
        />,
      )

      await userEvent.type(screen.getByLabelText('URL Regex:'), 'url pattern')
      await userEvent.selectOptions(screen.getByLabelText('Style:'), [style])
      await userEvent.click(screen.getByText('Save'))

      expect(res).toEqual({
        warningStyle: style,
        pattern: 'url pattern',
        backgroundColor: 'FF0000',
        text: 'Warning! This is Production!',
        textColor: 'FFFFFF',
      })
    })

    test('submit existing unchanged', async () => {
      let res: Warning | undefined

      render(
        <WarningForm
          onSave={(newValue) => {
            res = newValue
          }}
          value={{
            warningStyle: style,
            pattern: 'existing pattern',
            text: 'existing text',
            backgroundColor: '001',
            textColor: '002',
          }}
        />,
      )

      await userEvent.click(screen.getByText('Save'))

      expect(res).toEqual({
        warningStyle: style,
        pattern: 'existing pattern',
        text: 'existing text',
        backgroundColor: '001',
        textColor: '002',
      })
    })

    test('submit new fully filled', async () => {
      let res: Warning | undefined

      render(
        <WarningForm
          onSave={(newValue) => {
            res = newValue
          }}
          value={undefined}
        />,
      )

      await userEvent.type(screen.getByLabelText('URL Regex:'), 'url pattern')
      await userEvent.selectOptions(screen.getByLabelText('Style:'), [style])

      await userEvent.clear(screen.getByLabelText('Message:'))
      await userEvent.type(screen.getByLabelText('Message:'), 'message')

      await userEvent.clear(screen.getByLabelText('Text Color:'))
      await userEvent.type(screen.getByLabelText('Text Color:'), '001')

      await userEvent.clear(screen.getByLabelText('Background Color:'))
      await userEvent.type(screen.getByLabelText('Background Color:'), '002')

      await userEvent.click(screen.getByText('Save'))

      expect(res).toEqual({
        warningStyle: style,
        pattern: 'url pattern',
        text: 'message',
        textColor: '001',
        backgroundColor: '002',
      })
    })
  })
}

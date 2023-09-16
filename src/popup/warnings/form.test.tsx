import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WarningForm from './form'

describe('border form', () => {
  test('submit defaults', async () => {
    let res: any

    render(
      <WarningForm
        onSave={(newValue: any) => {
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
    let res: any

    render(
      <WarningForm
        onSave={(newValue: any) => {
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
    let res: any

    render(
      <WarningForm
        onSave={(newValue: any) => {
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
})) {
  describe(title, () => {
    test('submit defaults', async () => {
      let res: any

      render(
        <WarningForm
          onSave={(newValue: any) => {
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
      let res: any

      render(
        <WarningForm
          onSave={(newValue: any) => {
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
      let res: any

      render(
        <WarningForm
          onSave={(newValue: any) => {
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

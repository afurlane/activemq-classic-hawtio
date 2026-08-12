import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { MessageTable } from '../../../src/components/Common/MessageTable'
import { makeMessage } from '../../utils/makeMessage'

describe('MessageTable selection', () => {
  test('renders row and header checkboxes and forwards selection changes', async () => {
    const user = userEvent.setup()
    const onToggleMessage = jest.fn()
    const onToggleAll = jest.fn()

    render(
      <MessageTable
        messages={[
          makeMessage({ id: 'msg-1' }),
          makeMessage({ id: 'msg-2' }),
        ]}
        selectedMessageIds={[]}
        sortDirection="asc"
        onSort={jest.fn()}
        onToggleMessage={onToggleMessage}
        onToggleAll={onToggleAll}
      />,
    )

    const checkboxes = screen.getAllByRole('checkbox')

    await user.click(checkboxes[1])
    expect(onToggleMessage).toHaveBeenCalledWith('msg-1', true)

    await user.click(checkboxes[0])
    expect(onToggleAll).toHaveBeenCalledWith(true)
  })
})
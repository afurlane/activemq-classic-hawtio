import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { MoveMessageModal } from '../../../src/components/Queues/MoveMessageModal'

const singleMessageId = ['ID:1']
const multipleMessageIds = ['ID:1', 'ID:2']
const availableQueues = ['Orders.In', 'Orders.DLQ']
const singleAvailableQueue = ['Orders.In']

jest.mock('../../../src/components/Queues/BaseModal', () => ({
  BaseModal: ({ title, isOpen, isConfirmDisabled, onConfirm, children }: {
    title: string
    isOpen: boolean
    isConfirmDisabled?: boolean
    onConfirm: () => void
    children: React.ReactNode
  }) => (
    isOpen ? (
      <div>
        <h1>{title}</h1>
        {children}
        <button type="button" onClick={onConfirm} disabled={isConfirmDisabled}>
          Move
        </button>
      </div>
    ) : null
  )
}))

describe('MoveMessageModal', () => {
  test('lets users pick an existing queue as destination', async () => {
    const user = userEvent.setup()
    const onConfirm = jest.fn()

    render(
      <MoveMessageModal
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={onConfirm}
        messageIds={singleMessageId}
        availableQueues={availableQueues}
      />,
    )

    await user.click(screen.getByRole('combobox', { name: 'Destination queue' }))
    await user.click(screen.getByRole('option', { name: 'Orders.DLQ' }))
    await user.click(screen.getByRole('button', { name: 'Move' }))

    expect(onConfirm).toHaveBeenCalledWith(singleMessageId, 'Orders.DLQ')
  })

  test('lets users type a new queue destination manually', async () => {
    const user = userEvent.setup()
    const onConfirm = jest.fn()

    render(
      <MoveMessageModal
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={onConfirm}
        messageIds={multipleMessageIds}
        availableQueues={singleAvailableQueue}
      />,
    )

    await user.clear(screen.getByRole('combobox', { name: 'Destination queue' }))
    await user.type(screen.getByRole('combobox', { name: 'Destination queue' }), 'Orders.Archive')
    await user.click(screen.getByRole('button', { name: 'Move' }))

    expect(onConfirm).toHaveBeenCalledWith(multipleMessageIds, 'Orders.Archive')
  })
})
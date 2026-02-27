import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MessageModal } from '../../../src/components/Common/MessageModal'
import { makeMessage } from '../../utils/makeMessage'

describe('MessageModal', () => {
  test('Show title when opened', () => {
    const message = makeMessage({
      body: '{"foo":"bar"}',
      jms: { destination: 'queue://test' },
      properties: { b: 2 },
      extra: { size: 123 }
    })

    render(<MessageModal isOpen={true} message={message} onClose={() => {}} />)

    expect(screen.getByText('Message Details')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  test('No render when closed', () => {
    const message = makeMessage()

    const { container } = render(
      <MessageModal isOpen={false} message={message} onClose={() => {}} />
    )

    expect(container.firstChild).toBeNull()
  })

  test('Show formatted body', () => {
    const message = makeMessage({ body: '{"foo":"bar"}' })

    render(<MessageModal isOpen={true} message={message} onClose={() => {}} />)

    expect(screen.getByText(/foo/)).toBeInTheDocument()
  })

  test('Applies styles to CodeBlock when body is valid JSON', () => {
    const message = makeMessage({ body: '{"foo":"bar"}' })

    render(<MessageModal isOpen={true} message={message} onClose={() => {}} />)

    // PatternFly Modal usa un portal → il contenuto è in document.body
    const codeBlock = document.body.querySelector('.pf-v5-c-code-block')

    expect(codeBlock).not.toBeNull()
    expect(codeBlock).toHaveStyle('overflow-y: auto')
  })

})

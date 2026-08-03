import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MessageModal } from '../../../src/components/Common/MessageModal'
import { makeMessage } from '../../utils/makeMessage'

const noop = () => {}

describe('MessageModal', () => {
  test('Show title when opened', () => {
    const message = makeMessage({
      body: '{"foo":"bar"}',
      jms: { destination: 'queue://test' },
      properties: { b: 2 },
      extra: { size: 123 }
    })

    render(<MessageModal isOpen={true} message={message} onClose={noop} />)

    expect(screen.getByText('Message Details')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  test('No render when closed', () => {
    const message = makeMessage()

    const { container } = render(
      <MessageModal isOpen={false} message={message} onClose={noop} />
    )

    expect(container.firstChild).toBeNull()
  })

  test('Show formatted body', () => {
    const message = makeMessage({ body: '{"foo":"bar"}' })

    render(<MessageModal isOpen={true} message={message} onClose={noop} />)

    expect(screen.getByText(/foo/)).toBeInTheDocument()
  })

  test('Applies styles to CodeBlock when body is valid JSON', () => {
    const message = makeMessage({ body: '{"foo":"bar"}' })

    render(<MessageModal isOpen={true} message={message} onClose={noop} />)

    // PatternFly Modal usa un portal -> il contenuto e' in document.body.
    // Avoid hardcoding PF major class names (v5/v6) in selectors.
    const codeBlock = document.body.querySelector('[class*="c-code-block"]')

    expect(codeBlock).not.toBeNull()
    expect(codeBlock).toHaveStyle('overflow-y: auto')
  })

})

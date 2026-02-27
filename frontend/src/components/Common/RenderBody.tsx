import { CodeBlock, CodeBlockCode } from '@patternfly/react-core'
import { MessageTypeLabel } from './MessageTypeLabel'

export const renderBody = (m: any, maxLines?: number) => {
  const isText = m.bodyType === "text"

  const body = (() => {
    if (!isText || !maxLines) return m.body
    const lines = m.body.split("\n")
    if (lines.length <= maxLines) return m.body
    return lines.slice(0, maxLines).join("\n") + "\n…"
  })()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <MessageTypeLabel type={m.bodyType} />

      {m.bodyType === "text" && (
        <CodeBlock readOnly>
          <CodeBlockCode>{body}</CodeBlockCode>
        </CodeBlock>
      )}

      {m.bodyType === "map" && (
        <CodeBlock readOnly>
          <CodeBlockCode>{m.body}</CodeBlockCode>
        </CodeBlock>
      )}

      {m.bodyType === "bytes" && (
        <CodeBlock readOnly>
          <CodeBlockCode>{m.body}</CodeBlockCode>
        </CodeBlock>
      )}

      {m.bodyType === "object" && (
        <em>ObjectMessage — non visualizzabile</em>
      )}

      {m.bodyType === "stream" && (
        <CodeBlock readOnly>
          <CodeBlockCode>{m.body}</CodeBlockCode>
        </CodeBlock>
      )}

      {m.bodyType === "none" && (
        <em>No body</em>
      )}
    </div>
  )
}

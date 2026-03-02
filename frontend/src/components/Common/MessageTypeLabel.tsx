import React from 'react'
import { Label } from '@patternfly/react-core'

export const MessageTypeLabel: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "text":
      return <Label color="green">TextMessage</Label>
    case "bytes":
      return <Label color="blue">BytesMessage</Label>
    case "map":
      return <Label color="purple">MapMessage</Label>
    case "object":
      return <Label color="orange">ObjectMessage</Label>
    case "stream":
      return <Label color="cyan">StreamMessage</Label>
    default:
      return <Label color="grey">No body</Label>
  }
}

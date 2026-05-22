import React from 'react'
import { Form, FormGroup, TextInput, TextArea } from '@patternfly/react-core'

type FieldType = 'text' | 'textarea'

export interface Field {
  name: string
  label: string
  required?: boolean
  type?: FieldType
  value: string
  onChange: (_: unknown, v: string) => void
}

interface FormModalProps {
  fields: Field[]
}

export const FormModal: React.FC<FormModalProps> = ({ fields }) => (
  <Form>
    {fields.map(f => {
      return (
        <FormGroup key={f.name} label={f.label} isRequired={f.required}>
          {f.type === 'textarea' ? (
            <TextArea
              value={f.value}
              onChange={f.onChange}
              resizeOrientation="vertical"
            />
          ) : (
            <TextInput
              id={f.name}
              value={f.value}
              onChange={f.onChange}
            />
          )}
        </FormGroup>
      )
    })}
  </Form>
)

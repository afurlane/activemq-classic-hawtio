import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Title,
  Form,
  FormGroup,
  TextArea,
  Button,
  ButtonVariant
} from '@patternfly/react-core';

import { topics } from '../../services/topics';

export const TopicSendMessage: React.FC<{ mbean: string }> = ({ mbean }) => {
  const [body, setBody] = useState('');
  const [headers, setHeaders] = useState<Record<string, string>>({});

  const send = async () => {
    await topics.sendMessage(mbean, body, headers);
    setBody('');
  };

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Send Message</Title>

        <Form>
          <FormGroup label="Message body" fieldId="topic-body">
            <TextArea
              id="topic-body"
              value={body}
              onChange={(event, value) => setBody(value)}
              resizeOrientation="vertical"
            />
          </FormGroup>

          {/* In futuro puoi aggiungere header dinamici qui */}

          <Button
            variant={ButtonVariant.primary}
            onClick={send}
            isDisabled={!body.trim()}
          >
            Send
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

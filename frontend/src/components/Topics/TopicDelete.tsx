import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Title,
  Button,
  ButtonVariant,
  Modal
} from '@patternfly/react-core';

import { topics } from '../../services/topics';

export const TopicDelete: React.FC<{ mbean: string }> = ({ mbean }) => {
  const [isOpen, setIsOpen] = useState(false);

  const del = async () => {
    await topics.deleteTopic(mbean);
    setIsOpen(false);
  };

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Delete Topic</Title>

        <Button
          variant={ButtonVariant.danger}
          onClick={() => setIsOpen(true)}
        >
          Delete topic
        </Button>

        <Modal
          title="Confirm deletion"
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          actions={[
            <Button
              key="confirm"
              variant={ButtonVariant.danger}
              onClick={del}
            >
              Yes, delete
            </Button>,
            <Button
              key="cancel"
              variant={ButtonVariant.secondary}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          ]}
        >
          This action will permanently delete the topic.  
          This cannot be undone.
        </Modal>
      </CardBody>
    </Card>
  );
};

import {
	ModalHeader,
	ModalBody,
	ModalFooter,
	ExpandableSection,
	DescriptionList,
	DescriptionListGroup,
	DescriptionListTerm,
	DescriptionListDescription,
	CodeBlock,
	CodeBlockCode,
	ClipboardCopyButton,
	CodeBlockAction,
	Button
} from '@patternfly/react-core';
import {
	Modal
} from '@patternfly/react-core/deprecated';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Message } from '../../types/domain';
import { formatBody } from '../../utils/bodyFormatter';
import { useScrollStyles } from '../../utils/useScrollStyles';

const bodyHeadingStyle = { marginBottom: '0.5rem' };
const downloadSectionStyle = { marginTop: '1rem' };

export interface MessageModalProps {
  message: Message | null
  isOpen: boolean
  onClose: () => void
}

export const MessageModal: React.FC<MessageModalProps> = ({ message, isOpen, onClose }) => {
  const { modalScroll, bodyScroll, sectionScroll } = useScrollStyles();
  const headerRef = useRef<HTMLHeadingElement>(null);

  const { text, html, lang } = formatBody(message?.body ?? '');
  const bodyHtml = useMemo(() => ({ __html: html }), [html]);

  const handleCopyClick = useCallback(() => {
    navigator.clipboard.writeText(text);
  }, [text]);

  const handleDownloadClick = useCallback(() => {
    if (!message) return;

    const blob = new Blob([JSON.stringify(message, null, 2)], {
      type: 'application/json;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `message-${message.id ?? 'details'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [message]);

  useEffect(() => {
    if (!isOpen) return;

    const id = setTimeout(() => {
      requestAnimationFrame(() => {
        headerRef.current?.focus();
      });
    }, 50);

    return () => clearTimeout(id);
  }, [isOpen]);

  if (!isOpen || !message) return null;

  const copyAction = (
    <CodeBlockAction>
      <ClipboardCopyButton
        id="copy-body-button"
        textId="message-body"
        aria-label="Copy to clipboard"
        onClick={handleCopyClick}
      >
        Copy
      </ClipboardCopyButton>
    </CodeBlockAction>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="large">
      <ModalHeader>
        <h2 ref={headerRef} tabIndex={-1}>Message Details</h2>
      </ModalHeader>

      <ModalBody style={modalScroll}>
        {/* BODY */}
        <div>
          <h3 style={bodyHeadingStyle}>Body</h3>
          <CodeBlock actions={copyAction} style={bodyScroll}>
            <CodeBlockCode id="message-body" lang={lang} className={`language-${lang}`}>
              <span dangerouslySetInnerHTML={bodyHtml} />
            </CodeBlockCode>
          </CodeBlock>
        </div>

        {/* JMS */}
        <ExpandableSection toggleText="JMS Properties" isIndented>
          <div style={sectionScroll}>
            <DescriptionList>
              {Object.entries(message.jms ?? {}).map(([key, value]) =>
                value !== undefined && (
                  <DescriptionListGroup key={key}>
                    <DescriptionListTerm>{key}</DescriptionListTerm>
                    <DescriptionListDescription>{String(value)}</DescriptionListDescription>
                  </DescriptionListGroup>
                )
              )}
            </DescriptionList>
          </div>
        </ExpandableSection>

        {/* CUSTOM */}
        <ExpandableSection toggleText="Custom Properties" isIndented>
          <div style={sectionScroll}>
            <DescriptionList>
              {Object.entries(message.properties ?? {}).map(([key, value]) => (
                <DescriptionListGroup key={key}>
                  <DescriptionListTerm>{key}</DescriptionListTerm>
                  <DescriptionListDescription>{String(value)}</DescriptionListDescription>
                </DescriptionListGroup>
              ))}
            </DescriptionList>
          </div>
        </ExpandableSection>

        {/* EXTRA */}
        <ExpandableSection toggleText="Extra Info" isIndented>
          <div style={sectionScroll}>
            <DescriptionList>
              {Object.entries(message.extra ?? {}).map(([key, value]) =>
                value !== undefined && (
                  <DescriptionListGroup key={key}>
                    <DescriptionListTerm>{key}</DescriptionListTerm>
                    <DescriptionListDescription>{String(value)}</DescriptionListDescription>
                  </DescriptionListGroup>
                )
              )}
            </DescriptionList>
          </div>
        </ExpandableSection>

        {/* DOWNLOAD */}
        <div style={downloadSectionStyle}>
          <Button variant="secondary" onClick={handleDownloadClick}>
            Download Message
          </Button>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="primary" onClick={onClose}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};

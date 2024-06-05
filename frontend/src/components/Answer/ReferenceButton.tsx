import React, { useCallback, useState } from 'react';
import { IconButton, IIconProps, Link, TooltipHost } from '@fluentui/react';
import styles from './ReferenceButton.module.css';
import { Citation } from '@api/models';

const copyIcon: IIconProps = { iconName: 'Copy' };

interface ReferenceButtonProps {
  citation: Citation;
  referenceNumber: number;
}

const ReferenceButton: React.FC<ReferenceButtonProps> = ({ citation, referenceNumber }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(() => {
    setCopied(true);
    navigator.clipboard.writeText(citation.url).then(() => {
      setTimeout(() => setCopied(false), 500); // Reset copied state after 1.5s
    });
  }, [citation.url]);

  return (
    <div className={styles.referenceButtonContainer}>
      <div className={styles.referenceNumberContainer}>{referenceNumber}</div>
      <div className={styles.referenceTitleContainer}>
        <Link className={styles.title} href={citation.url}>
          {citation.title}
        </Link>
      </div>
      <div className={styles.referenceCopyContainer}>
        <TooltipHost content={copied ? 'Copied!' : 'Copy'}>
          <IconButton
            iconProps={copyIcon}
            onClick={copyToClipboard}
            ariaLabel="Copy link to clipboard"
            className={styles.copyIconButton}
          />
        </TooltipHost>
      </div>
    </div>
  );
};

export default ReferenceButton;

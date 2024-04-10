import { MessageBar, MessageBarType, IMessageBarProps } from "@fluentui/react";

interface DisclaimerProps extends IMessageBarProps {
  text: string | undefined;
}
export const Disclaimer: React.FC<DisclaimerProps> = (p: DisclaimerProps) => {
  return (
    <MessageBar
      messageBarType={MessageBarType.warning}
      isMultiline={false}
      onDismiss={p.onDismiss}
      dismissButtonAriaLabel="Close"
    >
      {p.text}
    </MessageBar>
  );
};
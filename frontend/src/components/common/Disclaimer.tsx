import { MessageBar, MessageBarType, IMessageBarProps } from "@fluentui/react";

interface IDisclaimerProps extends IMessageBarProps {
  text: string | undefined;
}
export const Disclaimer: React.FC<IDisclaimerProps> = (p: IDisclaimerProps) => {
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
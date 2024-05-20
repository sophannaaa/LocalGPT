import { MessageBar, MessageBarType, IMessageBarProps } from '@fluentui/react'

interface IDisclaimerProps extends IMessageBarProps {
  onDismiss: () => void
  text: string | undefined
  className?: string
}
export const Disclaimer: React.FC<IDisclaimerProps> = (p: IDisclaimerProps) => {
  return (
    <MessageBar
      className={p.className}
      messageBarType={MessageBarType.warning}
      onDismiss={p.onDismiss}
      dismissButtonAriaLabel="Close">
      {p.text}
    </MessageBar>
  )
}

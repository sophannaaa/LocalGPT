import { DefaultButton, IButtonProps, IButtonStyles } from '@fluentui/react'

interface IFAQButtonProps extends IButtonProps {
  onSend: (question: string, id?: string) => void
  question: string
  conversationId?: string
}

const buttonStyles: IButtonStyles = {
  root: {
    color: '#605E5C',
    fontFamily: 'Segoe UI',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    letterSpacing: '0em',
    textAlign: 'left',
    width: 'auto',
    padding: '8px 16px 8px 16px',
    margin: '0 8px',
    height: '130px',
    borderColor: '#D2D0CE',
    background: '#f3f3f3',
    borderRadius: '8px'
  },
  label: {
    fontWeight: 400
  }
}

export const FAQButton: React.FC<IFAQButtonProps> = ({ onSend, question, conversationId }) => {
  const sendQuestion = () => {
    if (conversationId) {
      onSend(question, conversationId)
    } else {
      onSend(question)
    }
  }

  return (
    <DefaultButton styles={buttonStyles} onClick={sendQuestion}>
      {question}
    </DefaultButton>
  )
}

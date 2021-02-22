export interface AuthenticationContent {
    signInOpen: boolean
    signUpOpen: boolean
    resetOpen: boolean
    confirmOpen: boolean
}

interface SharedAuthDialogProps {
    viewChanger: ((arg: Partial<AuthenticationContent>) => void),

    email: string,
    emailUpdater: React.Dispatch<React.SetStateAction<string>>,
}

export interface AuthDialogProps extends SharedAuthDialogProps {
    open: boolean
}

export interface AuthControlProps extends SharedAuthDialogProps{
    content: AuthenticationContent
}
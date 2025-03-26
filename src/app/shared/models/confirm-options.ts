export interface ConfirmOptions {
  header?: string;
  message?: string;
  accept?: () => void;
  reject?: () => void;
  icon?: string;
  acceptButtonProps?: {
    label: string;
    severity: string;
  };
  rejectButtonProps?: {
    label: string;
    severity: string;
    outlined: boolean;
  };
}

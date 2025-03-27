import { Injectable, inject } from '@angular/core';
import {
  ConfirmationService,
  MessageService,
  ToastMessageOptions,
} from 'primeng/api';
import { ConfirmOptions } from 'src/app/shared/models/confirm-options';

/**
 * Alert service.
 */
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  /** Confirmation service to manage confirm dialog. */
  private confirmationService = inject(ConfirmationService);

  /** Message service. */
  private messageService = inject(MessageService);

  /**
   * Display a message.
   *
   * @param message Message data.
   */
  displayMessage(message: ToastMessageOptions): void {
    this.messageService.add({ life: 5000, ...message });
  }

  /**
   * Display success message.
   *
   * @param message Message data.
   */
  displaySuccess(message: string): void {
    this.displayMessage({
      severity: 'success',
      summary: 'Éxito',
      detail: message,
    });
  }

  /**
   * Display error message.
   *
   * @param message Message data.
   */
  displayError(message: string): void {
    this.displayMessage({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }

  /**
   * Display info message.
   *
   * @param message Message data.
   */
  displayInfo(message: string): void {
    this.displayMessage({
      severity: 'info',
      summary: 'Información',
      detail: message,
    });
  }

  /**
   * Display confirmation dialog.
   *
   * @param options Confirmation dialog options.
   */
  displayConfirm(options: ConfirmOptions): void {
    this.confirmationService.confirm({
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-info-circle',
      ...options,
    });
  }

  /**
   * Clear all messages.
   */
  clearMessages(): void {
    this.messageService.clear();
  }
}

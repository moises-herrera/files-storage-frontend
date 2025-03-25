import { Injectable, inject } from '@angular/core';
import {
  ConfirmationService,
  MessageService,
  ToastMessageOptions,
} from 'primeng/api';

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
   * Display confirmation dialog.
   *
   * @param acceptAction Function called when the accept event is triggered.
   * @param rejectAction Function called when the reject event is triggered.
   */
  displayConfirm(acceptAction: () => void, rejectAction?: () => void): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: acceptAction,
      reject: rejectAction,
    });
  }
}

import { Component, inject } from '@angular/core';
import { MenuItem } from '../../models/menu-item';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AlertService } from 'src/app/core/services/alert.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  private readonly userService = inject(UserService);

  private readonly router = inject(Router);

  private readonly alertService = inject(AlertService);

  readonly links: MenuItem[] = [
    {
      title: 'Inicio',
      url: '/home',
      icon: 'pi pi-home',
    },
    {
      title: 'Archivos',
      url: '/storage',
      icon: 'pi pi-folder',
    },
    {
      title: 'Configuración',
      url: '/settings',
      icon: 'pi pi-cog',
    },
  ];

  logout(): void {
    this.userService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/auth/login', { replaceUrl: true });
      },
      error: () => {
        this.alertService.displayMessage({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cerrar sesión',
        });
      },
    });
  }
}

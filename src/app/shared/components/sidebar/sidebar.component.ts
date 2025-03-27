import { Component, inject } from '@angular/core';
import { MenuItem } from '../../models/menu-item';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AlertService } from 'src/app/core/services/alert.service';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  appName = environment.appName;

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
      title: 'Mis archivos',
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
        this.alertService.displayError('Error al cerrar sesión');
      },
    });
  }
}

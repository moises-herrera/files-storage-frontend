import { Component } from '@angular/core';
import { MenuItem } from '../../models/menu-item';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  readonly links: MenuItem[] = [
    {
      title: 'Home',
      url: '/home',
    },
    {
      title: 'Almacenamiento',
      url: '/storage',
    },
  ];
}

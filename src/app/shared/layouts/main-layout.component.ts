import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { TopNavComponent } from "../components/top-nav/top-nav.component";

@Component({
  selector: 'app-layout',
  imports: [RouterModule, SidebarComponent, TopNavComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {}

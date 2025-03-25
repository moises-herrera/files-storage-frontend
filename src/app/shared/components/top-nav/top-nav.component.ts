import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-top-nav',
  imports: [ButtonModule],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css',
})
export class TopNavComponent {
  appName = environment.appName;
}

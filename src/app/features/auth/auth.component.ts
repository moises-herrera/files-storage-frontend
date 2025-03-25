import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-auth',
  imports: [RouterModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
})
export class AuthComponent {
  appName = environment.appName;
}

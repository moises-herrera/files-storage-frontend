import { Component, computed, inject } from '@angular/core';
import { User } from 'src/app/core/models/user';
import { UserService } from 'src/app/core/services/user.service';
import { FoldersGridComponent } from './components/folders-grid/folders-grid.component';
import { FilesTableComponent } from './components/files-table/files-table.component';

@Component({
  selector: 'app-home',
  imports: [FoldersGridComponent, FilesTableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly userService = inject(UserService);

  user = computed<User>(() => this.userService.user());
}

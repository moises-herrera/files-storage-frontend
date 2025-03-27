import { Component } from '@angular/core';
import { FolderRelated } from 'src/app/core/models/folder-related';

@Component({
  selector: 'app-folders-grid',
  imports: [],
  templateUrl: './folders-grid.component.html',
  styleUrl: './folders-grid.component.css'
})
export class FoldersGridComponent {
  folders: FolderRelated[] = [];
}

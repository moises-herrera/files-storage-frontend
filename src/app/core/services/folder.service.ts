import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FolderContent } from 'src/app/core/models/folder-content';
import { Observable } from 'rxjs';
import { Folder } from '../models/folder';

const baseUrl = environment.baseApiUrl;

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  private readonly http = inject(HttpClient);

  getFolderContent(folderId?: string): Observable<FolderContent> {
    const params = new HttpParams().set('folderId', folderId || '');

    return this.http.get<FolderContent>(`${baseUrl}/folders`, {
      params,
    });
  }

  addFolder(name: string, parentFolderId?: string): Observable<Folder> {
    return this.http.post<Folder>(`${baseUrl}/folders`, {
      name,
      parentFolderId,
    });
  }

  updateFolder(folderId: string, name: string): Observable<Folder> {
    return this.http.patch<Folder>(`${baseUrl}/folders/${folderId}`, {
      name,
    });
  }

  deleteFolders(folderIds: string[]): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/folders`, {
      body: { folderIds },
    });
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FolderContent } from 'src/app/core/models/folder-content';
import { Observable } from 'rxjs';

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

  addFolder(name: string, parentFolderId?: string): Observable<void> {
    return this.http.post<void>(`${baseUrl}/folders`, {
      name,
      parentFolderId,
    });
  }

  deleteFolders(folderIds: string[]): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/folders`, {
      body: { folderIds },
    });
  }
}

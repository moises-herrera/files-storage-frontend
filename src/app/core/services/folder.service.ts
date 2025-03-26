import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FolderContent } from 'src/app/core/models/folder-content';
import { Observable, shareReplay } from 'rxjs';
import { Folder } from '../models/folder';
import { GetFolderContent } from '../models/get-folder-content';

const baseUrl = environment.baseApiUrl;

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  private readonly http = inject(HttpClient);

  getFolderContent({
    folderId,
    search,
    page,
    pageSize,
  }: GetFolderContent): Observable<FolderContent> {
    const params = new HttpParams()
      .set('folderId', folderId || '')
      .set('search', search || '')
      .set('page', page || '1')
      .set('pageSize', pageSize || '10');

    return this.http
      .get<FolderContent>(`${baseUrl}/folders`, {
        params,
      })
      .pipe(
        shareReplay({
          bufferSize: 1,
          refCount: true,
        })
      );
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

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FolderContent } from 'src/app/core/models/folder-content';
import { Observable, shareReplay } from 'rxjs';
import { Folder } from 'src/app/core/models/folder';
import { GetFolderContent } from 'src/app/core/models/get-folder-content';
import { FolderRelated } from 'src/app/core/models/folder-related';

const baseUrl = environment.baseApiUrl;

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  private readonly http = inject(HttpClient);

  getFolderContent({
    folderId,
    search,
    page = 1,
    pageSize = 10,
  }: GetFolderContent): Observable<FolderContent> {
    const params = new HttpParams()
      .set('folderId', folderId || '')
      .set('search', search || '')
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http
      .get<FolderContent>(`${baseUrl}/folders/owner-content`, {
        params,
      })
      .pipe(
        shareReplay({
          bufferSize: 1,
          refCount: true,
        })
      );
  }

  getRecentFolders(page = 1, pageSize = 10): Observable<FolderRelated[]> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);

    return this.http
      .get<FolderRelated[]>(`${baseUrl}/folders/recent`, {
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

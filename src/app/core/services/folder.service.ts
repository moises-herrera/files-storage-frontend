import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FolderContent } from 'src/app/core/models/folder-content';
import { Observable, shareReplay } from 'rxjs';
import { Folder } from 'src/app/core/models/folder';
import { GetFolderContent } from 'src/app/core/models/get-folder-content';
import { FolderRelated } from 'src/app/core/models/folder-related';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  private readonly configService = inject(ConfigService);

  private readonly baseUrl = this.configService.apiUrl;

  private readonly http = inject(HttpClient);

  addFolder(name: string, parentFolderId?: string): Observable<Folder> {
    return this.http.post<Folder>(`${this.baseUrl}/folders`, {
      name,
      parentFolderId,
    });
  }

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
      .get<FolderContent>(`${this.baseUrl}/folders/owner-content`, {
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
      .get<FolderRelated[]>(`${this.baseUrl}/folders/recent`, {
        params,
      })
      .pipe(
        shareReplay({
          bufferSize: 1,
          refCount: true,
        })
      );
  }

  downloadFolder(folderId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/folders/${folderId}/download`, {
      responseType: 'blob',
    });
  }

  updateFolder(folderId: string, name: string): Observable<Folder> {
    return this.http.patch<Folder>(`${this.baseUrl}/folders/${folderId}`, {
      name,
    });
  }

  deleteFolders(folderIds: string[]): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/folders`, {
      body: { folderIds },
    });
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileData } from 'src/app/core/models/file-data';
import { environment } from 'src/environments/environment';
import { File as FileModel } from 'src/app/core/models/file';
import { FileInfo } from 'src/app/core/models/file-info';

const baseUrl = `${environment.baseApiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private readonly http = inject(HttpClient);

  uploadFile(files: FileList, folderId: string): Observable<FileModel[]> {
    const formData = new FormData();
    formData.append('folderId', folderId);
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name);
    }

    return this.http.post<FileModel[]>(`${baseUrl}/files`, formData);
  }

  getRecentFiles(page = 1, pageSize = 10): Observable<FileInfo[]> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<FileInfo[]>(`${baseUrl}/files/recent`, { params });
  }

  getFileUrl(fileId: string): Observable<FileData> {
    return this.http.get<FileData>(`${baseUrl}/files/${fileId}`);
  }

  updateFile(fileId: string, name: string): Observable<FileModel> {
    return this.http.patch<FileModel>(`${baseUrl}/files/${fileId}`, {
      name,
    });
  }

  deleteFiles(fileIds: string[]): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/files`, {
      body: { fileIds },
    });
  }
}

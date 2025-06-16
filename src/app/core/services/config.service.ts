import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { EnvironmentConfig } from 'src/app/core/models/environment-config';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly http = inject(HttpClient);

  private config!: EnvironmentConfig;

  async loadConfig(): Promise<void> {
    this.config = await firstValueFrom(
      this.http.get<EnvironmentConfig>('/assets/config.json')
    );
  }

  get apiUrl(): string {
    return this.config?.apiUrl || 'http://localhost:3000/api';
  }
}

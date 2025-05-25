import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  private apiUrl = environment.apiYoutubeUrl;

  constructor(private httpClient: HttpClient) { }

  search(query: string, maxVideos: number = 10) {
    return this.httpClient.get<any>(`${this.apiUrl}/search`, {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: maxVideos.toString(),
        key: environment.youtubeApiKey
      }
    });
  }

  getVideoDetails(videoId: string) {
    return this.httpClient.get<any>(`${this.apiUrl}/videos`, {
      params: {
        part: 'snippet,contentDetails',
        id: videoId,
        key: environment.youtubeApiKey
      }
    })
  }
}

import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  private apiUrl = environment.apiYoutubeUrl;
  user: User = {
    userId: '',
    name: '',
    username: '',
    email: ''
  };

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    const user = this.authService.getUser();
    if(user) {
      this.user = user
    } else {
    }
  }

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

export interface User {
  userId: string,
  name: string,
  username: string,
  email: string
}

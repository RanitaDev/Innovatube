import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { YoutubeService } from '../../services/youtube.service';
import { SafePipe } from '../../shared/pipes/safe.pipe';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SafePipe,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule
  ],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.css'
})
export class VideosComponent {

  searchQuery: string = '';
  videos: any[] =[];
  errorMessage: string = '';
  maxVideos: number = 10;
  default: string = "NCS";

  constructor(
    private youtubeService: YoutubeService,
    private router: Router
  ) { }

  ngOnInit() {
    this.automaticSearch(this.default);
  }

  onSearch() {
    if(!this.searchQuery.trim()) {
      this.errorMessage = 'Ingrese un valor para buscar';
      return;
    }

    this.automaticSearch(this.searchQuery);
  }

  automaticSearch(query: string) {
    this.youtubeService.search(query).subscribe({
      next: (res: any) => {
        this.videos = res.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.default.url,
          channelTitle: item.snippet.channelTitle,
          publishedAt: new Date(item.snippet.publishedAt)
        }));
        this.errorMessage = '';
      }
    })
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}

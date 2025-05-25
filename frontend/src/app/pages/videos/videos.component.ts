import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { YoutubeService } from '../../services/youtube.service';
import { SafePipe } from '../../shared/pipes/safe.pipe';

@Component({
  selector: 'app-videos',
  imports: [CommonModule, FormsModule, SafePipe],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.css'
})
export class VideosComponent {

  searchQuery: string = '';
  videos: any[] =[];
  errorMessage: string = '';
  maxVideos: number = 10;
  default: string = "Minecraft";

  constructor(private youtubeService: YoutubeService) { }

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
    this.youtubeService.search(this.searchQuery).subscribe({
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

}

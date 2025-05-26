import { UserService } from './../../services/user.service';
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
import { AuthService } from '../../services/auth.service';
import {MatMenuModule} from '@angular/material/menu';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

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
    MatCardModule,
    MatMenuModule,
    MatSnackBarModule
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
  user: any = {};
  showLog: boolean = false;
  favsVideos: string[] = [];
  seeFavs: boolean = false;

  constructor(
    private youtubeService: YoutubeService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.favsVideos = this.user?.favs || [];
    this.showLog = this.user === null ? true : false;
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

        this.videos = [...this.videos];
        this.errorMessage = '';
      }
    })
  }

  isFavorite(id: string){
    return this.favsVideos?.includes(id)
  }

  toggle(id: string): void {
  if(!this.user) {
    this.snackBar.open(
          'Inicia sesión para agregar favoritos',
          'Cerrar',
          {
            duration: 4000,
            panelClass: ['snackbar-error'],
          }
        )
    this.router.navigate(['/login']);
    return;
  }

  const isFav = this.favsVideos.includes(id);

  if (isFav) {
    // POP
    this.favsVideos = this.favsVideos.filter(fav => fav !== id);
  } else {
    // PUISH
    this.favsVideos.push(id);
  }

  console.log(this.user);

  this.userService.updateUser(this.user.userId, { favs: this.favsVideos })
    .subscribe({
      next: (res) => {
        this.snackBar.open(
          'Favoritos actualizados',
          'Cerrar',
          {
            duration: 4000,
            panelClass: ['snackbar-error'],
          }
        )
      },
      error: (err) => {
        this.snackBar.open(
          'Error al actualizar favoritos',
          'Cerrar',
          {
            duration: 4000,
            panelClass: ['snackbar-error'],
          }
        )
      }
    });
}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    this.user = null;
    window.location.reload();
  }

  onlyFavs() {
    this.seeFavs = !this.seeFavs;

    if(this.seeFavs) {
      this.videos = this.favsVideos.map(id => {
        const video = this.videos.find(v => v.id === id);
        return {
          id: video.id,
          title: video.title,
          description: video.description,
          thumbnail: video.thumbnail,
          channelTitle: video.channelTitle,
          publishedAt: video.publishedAt
        };
      })
    } else {
      this.automaticSearch(this.default);
    }
  }

}

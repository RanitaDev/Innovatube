import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  pass = '';
  user = '';
  errorMessage = '';
  form: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      user: [''],
      password: [''],
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToVideos() {
    this.router.navigate(['/videos']);
  }

  onSubmit() {
    if(!this.user || !this.pass) {
      return;
    }

    const credentials = {
      email: this.user,
      password: this.pass
    }

    this.auth.login(credentials).subscribe({
      next: (res) => {
        localStorage.setItem('token', (res as any).token);
        this.router.navigate(['/videos']);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open(
          'Credenciales incorrectas o problemas con el servidor',
          'Cerrar',
          {
            duration: 4000,
            panelClass: ['snackbar-error'],
          }
        )
      }
    });
  }

}

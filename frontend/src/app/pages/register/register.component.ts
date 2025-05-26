import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { RecaptchaModule } from "ng-recaptcha";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatSnackBarModule,
    RecaptchaModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  name = '';
  lastName = '';
  email = '';
  pass = '';
  checkPass = '';
  user = '';
  errorMessage = '';
  passWrite: boolean = false;
  noMatch = false;
  captchaResponse: string = '';
  completeCaptcha: boolean = false;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) {}

  ngOnInit(){
    this.passWrite = false;
  }

  checkPasswords(){
  }

  onWritePass(){
    if(this.pass.length < 3) {
      this.passWrite = false;
      return;
    }
    this.passWrite = true;
  }

  onCaptchaResolved(response: any) {
    this.captchaResponse = response;
    this.completeCaptcha = true;
  }

  checkMatch() {
  if(this.pass !== this.checkPass) {
    this.noMatch = true;
      this.snackBar.open(
        'Las contraseñas no coinciden',
        'Cerrar',
        {
          duration: 2000,
          panelClass: ['snackbar-warning'],
        }
      )
    }
  }


  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToVideos() {
    this.router.navigate(['/videos']);
  }

  onSubmit() {
    if(!this.name || !this.lastName || !this.user ||
      !this.email || !this.pass || !this.checkPass ||
      this.noMatch || !this.completeCaptcha) {
      return;
    }

    const credentials = {
      name: this.name,
      lastName: this.lastName,
      username: this.user,
      password: this.pass,
      email: this.email
    }

    this.auth.register(credentials).subscribe({
      next: (res) => {
        localStorage.setItem('token', (res as any).token);
        this.router.navigate(['/videos']);
      },
      error: (err) => {
        console.error(err);

        const message = err.error.msg || 'Hubo un problema, intentalo más tarde'

        this.snackBar.open(
          message,
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

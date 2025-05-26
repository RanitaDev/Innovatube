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
    MatInputModule
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
    private auth: AuthService
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
      alert('Completa los campos');
      return;
    }

    this.auth.login(this.form.value).subscribe({
      next: (res) => {
        console.log('Login...');
        this.router.navigate(['/videos']);
      },
      error: (err) => {
        console.error(err);
        alert('Credenciales incorrectas o problemas con el servidor');
      }
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UsuarioService } from '../servicios/usuario.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CloseDialogComponent } from '../close-dialog/close-dialog.component';
import { SessionStorageService } from '../servicios/session-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    public dialog: MatDialog,
    public sessionStorageService: SessionStorageService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {}

  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/), Validators.minLength(8), Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  public onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.dialog.open(CloseDialogComponent, {
        data: { message: 'Revisa los valores del formulario' }
      });
      return;
    }

    this.usuarioService.Login(this.loginForm.value).subscribe({
      next: (response: any) => {
        this.sessionStorageService.setData("usuarioId", response.usuarioId);
        this.router.navigate(['/chat']);
      },
      error: (error: any) => {
        this.dialog.open(CloseDialogComponent, {
          data: { message: error }
        });
      }
    });
  }

  validarContrasena(control: any) {
    const contrasena = control.value;
    const tieneMayuscula = /[A-Z]/.test(contrasena);
    const tieneMinuscula = /[a-z]/.test(contrasena);
    const tieneNumero = /\d/.test(contrasena);

    const esValido = tieneMayuscula && tieneMinuscula && tieneNumero;
    //console.log("Contraseña esValido ", esValido);
    return esValido ? null : { 'Al menos 1 mayúscula, 1 minúscula y 1 número': true };
  }

  public onReset(): void {
    this.submitted = false;
    this.loginForm.reset();
  }

  get form(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }
}

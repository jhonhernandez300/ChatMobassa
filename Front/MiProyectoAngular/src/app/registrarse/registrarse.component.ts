import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../servicios/usuario.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CloseDialogComponent } from '../close-dialog/close-dialog.component';
import { iUsuario } from '../Interfaces/iUsuario';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.css']
})
export class RegistrarseComponent implements OnInit, AfterViewInit {
  myForm!: FormGroup; 
  submitted = false; 
  selectedUsuarioId!: number;
  selectedRolId: number = 0;  
  
  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {   
    
  }

  ngAfterViewInit() {
    const appRoot = document.querySelector('app-root');
    if (appRoot?.getAttribute('aria-hidden') === 'true') {
      appRoot.removeAttribute('aria-hidden');
    }
  }

  private initializeForm(): void {
    this.myForm = this.formBuilder.group({                                
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      correo: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/), Validators.minLength(8), Validators.maxLength(30)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        this.validarContrasena 
      ]],
      apodo: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      imagenURL: ['URL-de-imagen-por-defecto.jpg' ]
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
    this.myForm.reset();
  }

  public async onSubmit(): Promise<void> {
    this.submitted = true;         

    if (this.myForm.invalid) {      
      this.dialog.open(CloseDialogComponent, {            
        data: { message: "Revisa los valores del formulario" } 
      });
      return;
    }            
        
    this.usuarioService.GuardarUsuario(this.myForm.value).subscribe({
      next: (response: any) => {          
          this.dialog.open(CloseDialogComponent, {            
            data: { message: "Usuario creado" } 
          });
          this.myForm.reset();
      },
      error: (error: any) => {          
          this.dialog.open(CloseDialogComponent, {            
            data: { message: error } 
          });
      }
  });     
  }

  get form(): { [key: string]: AbstractControl; }
  {
      return this.myForm.controls;
  }
}

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../servicios/usuario.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CloseDialogComponent } from '../close-dialog/close-dialog.component';
import { iUsuario } from '../Interfaces/iUsuario';
import { AfterViewInit } from '@angular/core';
import { SessionStorageService } from '../servicios/session-storage.service';

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
  selectedFile!: File;
  
  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    public dialog: MatDialog,
    public sessionStorageService: SessionStorageService
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
      imagenURL: ['' ]
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  
  public async onSubmit(): Promise<void> {
    this.submitted = true;
  
    if (this.myForm.invalid) {
      this.dialog.open(CloseDialogComponent, {
        data: { message: "Revisa los valores del formulario" }
      });
      return;
    }
  
    const formData = new FormData();
  
    //Forzar UsuarioId a 0 para que se autoincremente en el backend
    formData.append('UsuarioId', '0');
  
    //Manejo seguro de los valores del formulario
    Object.keys(this.myForm.value).forEach(key => {
      if (this.myForm.value[key] !== null && this.myForm.value[key] !== undefined) {
        formData.append(key, this.myForm.value[key]);
      }
    });
  
    //Agregar imagen si el usuario ha seleccionado una
    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile);
    }  
    
    this.usuarioService.GuardarUsuario(formData).subscribe({
      next: (response: any) => {
        this.dialog.open(CloseDialogComponent, {
          data: { message: "Usuario creado" }
        });
        this.myForm.reset();        
        this.router.navigate(['/login']);
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

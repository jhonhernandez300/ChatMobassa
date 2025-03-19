import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { iUsuario } from '../Interfaces/iUsuario';
import { iUsuarioCorto } from '../Interfaces/iUsuarioCorto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public apiUrl = 'https://localhost:7276/api/Usuarios'; 

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  };  

  GuardarUsuario(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/GuardarUsuario`, formData).pipe(
      catchError(error => {
        console.error('Error al guardar usuario:', error);
        return throwError(error);
      })
    );
  }  

  Login(login: iUsuarioCorto): Observable<any> {            
    return this.http.post(`${this.apiUrl}/Login`, login).pipe(
      catchError(error => {
          console.error('Request error:', error);
          const errorMessage = error?.error?.message || 'Error en la solicitud';
          return throwError(() => new Error(errorMessage));
      })    
    );    
  }
}
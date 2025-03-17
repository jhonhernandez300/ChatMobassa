import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { iUsuario } from '../Interfaces/iUsuario';
import { iUsuarioCorto } from '../Interfaces/iUsuarioCorto';
//import { iLogin } from '../interfaces/iLogin';


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

  ObtenerNombreUsuario(usuarioId: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/ObtenerNombre/${usuarioId}`, { responseType: 'text' }) // 👀 Forzamos texto
      .pipe(
        catchError(error => {
          console.error('Error al obtener el nombre del usuario:', error);
          return throwError(() => new Error('Error al obtener el nombre del usuario'));
        })
      );
  }  

  GuardarUsuario(usuario: iUsuario): Observable<iUsuario[]> {
    return this.http.post<iUsuario[]>(`${this.apiUrl}/GuardarUsuario`, usuario, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error:', error);
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
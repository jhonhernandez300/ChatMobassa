import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { iUsuario } from '../Interfaces/iUsuario';
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

  GuardarUsuario(usuario: iUsuario): Observable<iUsuario[]> {
    return this.http.post<iUsuario[]>(`${this.apiUrl}/GuardarUsuario`, usuario, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error:', error);
          return throwError(error);
        })
      );
  }
  

  // ActualizarUsuario(usuario: iUsuarioConRolDTO): Observable<any> {             
  //   return this.http.put(`${this.apiUrl}/ActualizarUsuario/${usuario.usuarioId}`, usuario).pipe(
  //     catchError(error => {
  //         console.error('Request error:', error);
  //         return throwError(error);
  //     })    
  //   );    
  // } 
  
  // Login(login: iLogin): Observable<any> {            
  //   return this.http.post(`${this.apiUrl}/Login`, login).pipe(
  //     catchError(error => {
  //         console.error('Request error:', error);
  //         const errorMessage = error?.error?.message || 'Error en la solicitud';
  //         return throwError(() => new Error(errorMessage));
  //     })    
  //   );    
  // }

  // BorrarUsuario(id: number): Observable<any> {             
  //   return this.http.delete(`${this.apiUrl}/BorrarUsuario` + "/" + id).pipe(
  //     catchError(error => {
  //         console.error('Request error:', error);
  //         return throwError(error);
  //     })    
  //   );    
  // }

  

  // ObtenerTodosLosUsuariosAsync(): Observable<any> {             
  //   return this.http.get(`${this.apiUrl}/ObtenerTodosLosUsuariosAsync`).pipe(
  //     catchError(error => {
  //         console.error('Request error:', error);
  //         return throwError(error);
  //     })    
  //   );    
  
}
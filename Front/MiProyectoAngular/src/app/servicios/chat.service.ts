import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { iMensaje } from '../Interfaces/iMensaje';
import { iMensajeConUsuarioNombre } from '../Interfaces/iMensajeConUsuarioNombre';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection!: HubConnection;
  private mensajesSubject = new Subject<iMensajeConUsuarioNombre>();
  private apiUrl = 'https://localhost:7276/api/mensajes';

  constructor(private http: HttpClient) {}

  obtenerMensajes(): Observable<iMensajeConUsuarioNombre[]> {
    return this.http.get<iMensajeConUsuarioNombre[]>(`${this.apiUrl}/ObtenerMensajes`);
  }

  enviarMensaje(mensaje: iMensaje) {
    mensaje.UsuarioId = Number(mensaje.UsuarioId);    

    this.http.post<iMensaje>(`${this.apiUrl}/GuardarMensaje`, mensaje).subscribe({
      next: () => console.log('Mensaje guardado correctamente'),
      error: err => console.error('Error en la API:', err)
    });

    if (this.hubConnection) {
      this.hubConnection.invoke('EnviarMensaje', mensaje)
        .catch(err => console.error('Error al enviar mensaje a SignalR:', err));
    }
  }

  iniciarConexion() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7276/chathub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log('Conectado a SignalR'))
      .catch(err => console.error('Error al conectar SignalR', err));

    // Escuchar mensajes entrantes
    this.hubConnection.on('RecibirMensaje', (mensaje: iMensaje) => {
      console.log('Mensaje recibido:', mensaje);
    
      this.http.get<string>(`${this.apiUrl}/ObtenerNombre/${mensaje.UsuarioId}`).subscribe({
        next: (usuarioNombre) => {
          const mensajeConUsuario: iMensajeConUsuarioNombre = { 
            id: mensaje.Id,  // Asegurar que tenga un id
            contenido: mensaje.Contenido,  // Asignar correctamente el contenido
            fechaYHora: mensaje.FechaYHora,  // Asegurar la fecha y hora
            usuarioId: mensaje.UsuarioId,  // Asegurar el usuarioId
            usuarioNombre: usuarioNombre  // Agregar el nombre del usuario
          };
    
          this.mensajesSubject.next(mensajeConUsuario);
        },
        error: (error) => {
          console.error('Error al obtener el nombre del usuario:', error);
        }
      });
    });
  }

  obtenerMensajesEnTiempoReal(): Observable<iMensajeConUsuarioNombre> {
    return this.mensajesSubject.asObservable();
  }
}

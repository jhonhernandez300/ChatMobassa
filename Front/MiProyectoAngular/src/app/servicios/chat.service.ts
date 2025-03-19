import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { iMensaje } from '../Interfaces/iMensaje';
import { iMensajeConUsuario } from '../Interfaces/iMensajeConUsuario';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection!: HubConnection;
  private mensajesSubject = new Subject<iMensajeConUsuario>();
  private apiUrl = 'https://localhost:7276/api/mensajes';

  constructor(private http: HttpClient) {}

  obtenerMensajes(): Observable<iMensajeConUsuario[]> {
    return this.http.get<iMensajeConUsuario[]>(`${this.apiUrl}/ObtenerMensajesConUsuario`);
  }

  enviarMensaje(mensaje: iMensajeConUsuario) {
    console.log(mensaje);
    mensaje.usuarioId = Number(mensaje.usuarioId);
    mensaje.fechaYHora = new Date();
  
    this.http.post<iMensajeConUsuario>(`${this.apiUrl}/GuardarMensaje`, mensaje).subscribe({
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
    this.hubConnection.on('RecibirMensaje', (mensaje: iMensajeConUsuario) => {       
    
      if (!mensaje.usuarioId) {
        console.error('Error: UsuarioId es undefined o null');
        return;
      }
    
      // Directamente usamos el mensaje sin hacer otra petición HTTP
      this.mensajesSubject.next(mensaje);
    });    
  }  

  obtenerMensajesEnTiempoReal(): Observable<iMensajeConUsuario> {
    return this.mensajesSubject.asObservable();
  }
  
}

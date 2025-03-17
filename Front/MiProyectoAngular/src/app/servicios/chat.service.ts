import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { iMensaje } from '../Interfaces/iMensaje';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private hubConnection!: HubConnection;
  private mensajesSubject = new Subject<iMensaje>();
  private apiUrl = 'https://localhost:7276/api/mensajes';

  constructor(private http: HttpClient) {}

  obtenerMensajes(): Observable<iMensaje[]> {
    return this.http.get<iMensaje[]>(`${this.apiUrl}/ObtenerMensajes`);
  }

  enviarMensaje(mensaje: iMensaje) {
    // Asegurar que UsuarioId sea un número
    mensaje.UsuarioId = Number(mensaje.UsuarioId);    

    // Guardar mensaje en la API
    this.http.post<iMensaje>(`${this.apiUrl}/GuardarMensaje`, mensaje).subscribe({
      next: () => console.log('Mensaje guardado correctamente'),
      error: err => console.error('Error en la API:', err)
    });

    // Enviar mensaje a través de SignalR
    if (this.hubConnection) {
      this.hubConnection.invoke('EnviarMensaje', mensaje)
        .catch(err => console.error('Error al enviar mensaje a SignalR:', err));
    }
  }

  iniciarConexion() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7276/chathub')
      .withAutomaticReconnect() // Intentar reconectar automáticamente
      .build();

    this.hubConnection.start()
      .then(() => console.log('Conectado a SignalR'))
      .catch(err => console.error('Error al conectar SignalR', err));

    // Escuchar mensajes entrantes
    this.hubConnection.on('RecibirMensaje', (mensaje: iMensaje) => {
      console.log('Mensaje recibido:', mensaje);
      this.mensajesSubject.next(mensaje);
    });
  }

  obtenerMensajesEnTiempoReal(): Observable<iMensaje> {
    return this.mensajesSubject.asObservable();
  }
}

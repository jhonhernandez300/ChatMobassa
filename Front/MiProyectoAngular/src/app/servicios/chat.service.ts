import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private hubConnection!: HubConnection;
  private mensajesSubject = new Subject<{ usuario: string, mensaje: string }>();
  private apiUrl = 'https://localhost:7276/api/mensajes';

  constructor(private http: HttpClient) {}

  obtenerMensajes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  enviarMensaje(usuario: string, mensaje: string) {
    this.http.post(this.apiUrl, { usuario, contenido: mensaje }).subscribe();
    this.hubConnection.invoke('EnviarMensaje', usuario, mensaje);
  }

  iniciarConexion() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7276/chathub')
      .build();

    this.hubConnection.start().catch(err => console.error('Error al conectar SignalR', err));

    this.hubConnection.on('RecibirMensaje', (usuario: string, mensaje: string) => {
      this.mensajesSubject.next({ usuario, mensaje });
    });
  }

  obtenerMensajesEnTiempoReal(): Observable<{ usuario: string, mensaje: string }> {
    return this.mensajesSubject.asObservable();
  }
}

import { Component, OnInit } from '@angular/core';
import { ChatService } from '../servicios/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  mensajes: { usuario: string, mensaje: string }[] = [];
  usuario = 'Usuario' + Math.floor(Math.random() * 100);
  mensaje = '';

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.iniciarConexion();
    this.chatService.obtenerMensajes().subscribe(mensajes => this.mensajes = mensajes);
    this.chatService.obtenerMensajesEnTiempoReal().subscribe(mensaje => this.mensajes.push(mensaje));
  }

  enviarMensaje() {
    if (this.mensaje.trim()) {
      this.chatService.enviarMensaje(this.usuario, this.mensaje);
      this.mensaje = '';
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { ChatService } from '../servicios/chat.service';
import { SessionStorageService } from '../servicios/session-storage.service';
import { iMensaje } from '../Interfaces/iMensaje';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {  
  mensajes: {    
      Id: number, 
      Contenido: string,
      FechaYHora: Date,    
      UsuarioId: number  
  }[] = []
  usuario: number = 0;
  inputMensaje: string = '';
  mensaje: iMensaje = {
    Id: 0, 
    Contenido: '',
    FechaYHora: new Date(),    
    UsuarioId: 0  
  };

  constructor(
    private chatService: ChatService,
    public sessionStorageService: SessionStorageService
  ) {}

  ngOnInit() {
    this.obtenerUsuario();
    this.chatService.iniciarConexion();
    // this.chatService.obtenerMensajes().subscribe(mensajes => this.mensajes = mensajes);
    // this.chatService.obtenerMensajesEnTiempoReal().subscribe(mensaje => this.mensajes.push(mensaje));
  }

  obtenerUsuario(){
    this.usuario = this.sessionStorageService.getData("usuarioId");
    console.log(this.usuario);
  }

  enviarMensaje() {
    if (this.inputMensaje.trim()) {
      this.mensaje.Contenido = this.inputMensaje;
      this.mensaje.UsuarioId = this.usuario;
      this.chatService.enviarMensaje(this.mensaje);
      this.inputMensaje = '';
    }
  }
}
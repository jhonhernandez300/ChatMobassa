import { Component, OnInit } from '@angular/core';
import { ChatService } from '../servicios/chat.service';
import { UsuarioService } from '../servicios/usuario.service';
import { SessionStorageService } from '../servicios/session-storage.service';
import { iMensajeConUsuarioNombre } from '../Interfaces/iMensajeConUsuarioNombre';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {  
  mensajes: iMensajeConUsuarioNombre[] = []; // ✅ Ahora usa la nueva interfaz
  usuarioId: number = 0;
  usuarioNombre: string = '';
  inputMensaje: string = '';

  constructor(
    private chatService: ChatService,
    public sessionStorageService: SessionStorageService,
    private usuarioService: UsuarioService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.obtenerUsuario();
  }

  obtenerUsuario() {
    this.usuarioId = this.sessionStorageService.getData("usuarioId");

    if (this.usuarioId) {      
      console.log(this.usuarioId);
      this.obtenerNombreUsuario();
      this.cargarMensajes();
      this.chatService.iniciarConexion();
      this.escucharMensajesEnTiempoReal();
    } else {
      console.error('No se encontró el ID del usuario en sessionStorage.');
    }
  }

  obtenerNombreUsuario() {
    //console.log(this.usuario);
    this.usuarioService.ObtenerNombreUsuario(this.usuarioId).subscribe({      
      next: (nombre: string) => this.usuarioNombre = nombre,
      error: (error) => console.error('Error al obtener el nombre del usuario:', error)
    });
  }

  cargarMensajes() {
    this.chatService.obtenerMensajes().subscribe({      
      next: (mensajes: iMensajeConUsuarioNombre[]) => {
        console.log('Mensajes recibidos:', mensajes);
        this.mensajes = mensajes;
        this.cdr.detectChanges();  // Forzar actualización de la vista
      },
      error: (error) => console.error('Error al obtener los mensajes:', error)
    });
  }

  escucharMensajesEnTiempoReal() {
    this.chatService.obtenerMensajesEnTiempoReal().subscribe({
      next: (mensaje: iMensajeConUsuarioNombre) => {
        if (!this.mensajes.some(m => m.id === mensaje.id)) {
          this.mensajes.push(mensaje);
        }
      },
      error: (error) => console.error('Error al recibir mensaje en tiempo real:', error)
    });
  }

  enviarMensaje() {
    if (this.inputMensaje.trim()) {
      const nuevoMensaje = {
        Id: 0, //En el backend se pone uno autoincrementable 
        Contenido: this.inputMensaje,
        FechaYHora: new Date(),
        UsuarioId: this.usuarioId,
        UsuarioNombre: this.usuarioNombre // ✅ Enviamos el nombre del usuario
      };

      this.chatService.enviarMensaje(nuevoMensaje);
      this.inputMensaje = '';
    }
  }
}

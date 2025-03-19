import { Component, OnInit } from '@angular/core';
import { ChatService } from '../servicios/chat.service';
import { UsuarioService } from '../servicios/usuario.service';
import { SessionStorageService } from '../servicios/session-storage.service';
import { iMensajeConUsuarioNombre } from '../Interfaces/iMensajeConUsuarioNombre';
import { ChangeDetectorRef } from '@angular/core';
import { ApiServiceService } from '../servicios/api-service.service';
import { iMensajeConUsuario } from '../Interfaces/iMensajeConUsuario';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {    
  usuarioId: number = 0;
  usuarioNombre: string = '';
  inputMensaje: string = '';
  searchTerm = '';
  imagenRuta: string | null = null;
  gifUrl: string | null = null;
  videoUrl: string | null = null;
  mensajes: iMensajeConUsuario[] = [];

  constructor(
    private chatService: ChatService,
    public sessionStorageService: SessionStorageService,
    private usuarioService: UsuarioService, 
    private cdr: ChangeDetectorRef,
    private apiServiceService: ApiServiceService
  ) {}  

  ngOnInit() {
    this.obtenerUsuario();
  }

  obtenerUsuario() {
    this.usuarioId = this.sessionStorageService.getData("usuarioId");

    if (this.usuarioId) {      
      console.log(this.usuarioId);      
      this.cargarMensajes();
      
      this.chatService.iniciarConexion();
      this.escucharMensajesEnTiempoReal();
    } else {
      console.error('No se encontró el ID del usuario en sessionStorage.');
    }
  } 

  getImagenUrl(nombreArchivo: string | null): string {
    if (!nombreArchivo || nombreArchivo.trim() === '') {
      return 'assets/default-user.png'; // Imagen por defecto si no hay imagen
    }
    return `https://localhost:7276/imagenes/${nombreArchivo}`;
  }

  cargarMensajes() {
    this.chatService.obtenerMensajes().subscribe({
      next: (mensajes: iMensajeConUsuario[]) => {
        console.log('Mensajes recibidos:', mensajes);
        this.mensajes = mensajes;
        this.cdr.detectChanges(); // Forzar actualización de la vista
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

  searchGif() {
    this.apiServiceService.getGiphyGif(this.searchTerm).subscribe(response => {
      this.gifUrl = response.data.length > 0 ? response.data[0].images.original.url : null;
      this.videoUrl = null;
    });
  }

  searchVideo() {
    this.apiServiceService.getYoutubeVideo(this.searchTerm).subscribe(response => {
      this.videoUrl = response.items.length > 0 ? `https://www.youtube.com/watch?v=${response.items[0].id.videoId}` : null;
      this.gifUrl = null;
    });
  }
}

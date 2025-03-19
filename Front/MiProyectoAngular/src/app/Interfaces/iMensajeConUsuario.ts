export interface iMensajeConUsuario {
  id: number;
  contenido: string;
  fechaYHora: Date;
  usuarioId: number;
  usuarioNombre: string;
  imagenRuta?: string;  // Imagen del usuario opcional
  gifUrl?: string;      // URL opcional de un GIF
  videoUrl?: string;    // URL opcional de un video
}

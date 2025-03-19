Esta aplicación se hizo con Angular 16.2.0, .net 8.0 y SQL 2019.
Es un chat en tiempo real que graba.

El backend tiene instalados los paquetes: 
* Microsoft.EntityFrameworkCore.SqlServer 9.0.3
* Microsoft.EntityFrameworkCore.Tools 9.0.3
* Swashbuckle.AspNetCore 6.4.0

En el front:
* Angular material 16.2.14
* Bootstrap 5.3.3
* Node js 20.14.0

Configuración  
Borrar el contenido de la carpeta Migrations  
En appsettings.json modificar Data Source por el nombre de su servidor de SQL, si usa usuario y contraseña, incluirlos:  
ConnectionString": "Data Source=localhost\\SQLEXPRESS; Initial catalog=MiProyectoAPI;Integrated Security=true; TrustServerCertificate=True;"  

Abrir la consola del administrador de paquetes y ejecutar estos dos comandos:  
add-migration inicio  
update-database  

Al correr el backend el url le mostrará el número de un puerto, copiarlo y en el front cambiarlo en estos archivos:  
chat.service.ts  
usuario.service.ts  
Haga el cambio aquí  
'https://localhost:7276/api/Usuarios';   

En una terminal para el front ejecute:  
ng serve -o  

Regístrese y luego logueese.  
A continuación podrá introducir mensajes en el chat junto con enlaces de vídeos de youtube o gifs animados.

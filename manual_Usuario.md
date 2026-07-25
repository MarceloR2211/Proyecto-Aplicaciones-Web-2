# MANUAL DE USUARIO - PLATAFORMA ISP INTERNET PRO

¡Bienvenido al **Manual de Usuario de la Plataforma ISP Internet Pro**! Este documento está diseñado para guiarle paso a paso a través de todas las funcionalidades, pantallas, botones y opciones de configuración de nuestra moderna plataforma de conectividad.

Ya sea un cliente que busca gestionar su servicio de fibra óptica o un administrador que supervisa la red y gestiona las solicitudes de los usuarios, este manual interactivo le proporcionará toda la información necesaria para dominar el sistema de forma ágil y autónoma, sin necesidad de conocimientos técnicos avanzados.

---

## ÍNDICE DE CONTENIDOS

1. [Introducción y Conceptos Generales](#1-introducción-y-conceptos-generales)
2. [Navegación e Interfaz de Usuario (Navbar Inteligente)](#2-navegación-e-interfaz-de-usuario-navbar-inteligente)
3. [Portal Público y Landing Page](#3-portal-público-y-landing-page)
   - 3.1. [Sección Hero (Presentación)](#31-sección-hero-presentación)
   - 3.2. [Grilla de Planes de Fibra Óptica](#32-grilla-de-planes-de-fibra-óptica)
   - 3.3. [Formulario de Consultas y Contacto](#33-formulario-de-consultas-y-contacto)
4. [Proceso de Autenticación (Acceso y Registro)](#4-proceso-de-autenticación-acceso-y-registro)
   - 4.1. [Pantalla de Inicio de Sesión (Login)](#41-pantalla-de-inicio-de-sesión-login)
   - 4.2. [Formulario de Creación de Cuenta (Registro de Clientes)](#42-formulario-de-creación-de-cuenta-registro-de-clientes)
5. [Módulo de Autoservicio del Cliente (Dashboard Cliente)](#5-módulo-de-autoservicio-del-cliente-dashboard-cliente)
   - 5.1. [Resumen del Plan Contratado](#51-resumen-del-plan-contratado)
   - 5.2. [Herramienta de Test de Velocidad en Tiempo Real](#52-herramienta-de-test-de-velocidad-en-tiempo-real)
   - 5.3. [Gestión y Actualización de Perfil](#53-gestión-y-actualización-de-perfil)
   - 5.4. [Sistema de Tickets de Soporte Técnico](#54-sistema-de-tickets-de-soporte-técnico)
6. [Módulo de Reseñas y Comentarios Públicos](#6-módulo-de-reseñas-y-comentarios-públicos)
   - 6.1. [Lectura de Reseñas y Calificaciones](#61-lectura-de-reseñas-y-calificaciones)
   - 6.2. [Publicación de Nuevos Comentarios (Clientes Autenticados)](#62-publicación-de-nuevos-comentarios-clientes-autenticados)
7. [Panel de Administración General (Dashboard Admin)](#7-panel-de-administración-general-dashboard-admin)
   - 7.1. [KPIs y Indicadores de Gestión Operativa](#71-kpis-y-indicadores-de-gestión-operativa)
   - 7.2. [Barra de Navegación Lateral (Sidebar)](#72-barra-de-navegación-lateral-sidebar)
   - 7.3. [Sección: Resumen Operativo](#73-sección-resumen-operativo)
   - 7.4. [Sección: Gestión de Consultas (Leads)](#74-sección-gestión-de-consultas-leads)
   - 7.5. [Sección: Catálogo de Planes (Altas, Bajas y Modificaciones)](#75-sección-catálogo-de-planes-altas-bajas-y-modificaciones)
   - 7.6. [Sección: Visualización de Usuarios y Roles](#76-sección-visualización-de-usuarios-y-roles)
   - 7.7. [Sección: Gestión y Moderación de Reseñas](#77-sección-gestión-y-moderación-de-reseñas)
8. [Resolución de Problemas Frecuentes](#8-resolución-de-problemas-frecuentes)

---

## 1. INTRODUCCIÓN Y CONCEPTOS GENERALES

El sistema **ISP Internet Pro** es una plataforma integral para la provisión de servicios de Internet de Fibra Óptica Simétrica (Residencial y Corporativo). Esta solución web facilita la interacción transparente entre el cliente y el proveedor de servicios de internet (ISP), ofreciendo desde herramientas de contratación directa hasta paneles administrativos avanzados de moderación de contenido y atención de solicitudes de servicio.

### Objetivos clave de la plataforma:
* **Simplicidad:** Permite a los usuarios finales registrarse, actualizar su información personal, realizar diagnósticos de velocidad y reportar inconvenientes técnicos en pocos clics.
* **Transparencia:** Muestra en tiempo real los planes de internet disponibles sincronizados de manera directa con la base de datos de la empresa.
* **Centralización Operativa:** Brinda a los administradores un panel de control consolidado para gestionar solicitudes de soporte, moderar comentarios públicos y actualizar el catálogo comercial.

---

## 2. NAVEGACIÓN E INTERFAZ DE USUARIO (NAVBAR INTELIGENTE)

El sistema cuenta con un **Navbar Inteligente (Barra de Navegación Global)** ubicado en la parte superior de todas las pantallas. Este componente se adapta automáticamente al estado de autenticación del usuario actual:

### Enlaces de navegación permanentes:
* **Inicio:** Redirige a la página principal de bienvenida.
* **Planes:** Dirige al catálogo público de planes de internet.
* **Consultas:** Abre el formulario de contacto para enviar solicitudes de información.
* **Comentarios:** Lleva al muro donde se visualizan y publican opiniones de los clientes.

### Comportamiento dinámico (Botones de Acción):
* **Usuario No Autenticado (Público):**
  - Muestra el botón de color naranja **INICIAR SESIÓN**. Al hacer clic, redirige al usuario a la pantalla de acceso.
* **Usuario Autenticado:**
  - El botón anterior se transforma en **MI CUENTA** (de color azul). Al hacer clic, el sistema analiza el rol almacenado de forma segura y redirige al panel correspondiente de forma automática:
    - Si su rol es **usuario** (cliente), se abre el **Dashboard de Cliente**.
    - Si su rol es **admin** (administrador), se abre el **Dashboard de Administración**.
  - Muestra un botón con icono de salida **LOGOUT** (flecha roja). Al presionarlo, finaliza la sesión activa del navegador de forma segura y limpia el historial de acceso, devolviendo al usuario al estado público.

---

## 3. PORTAL PÚBLICO Y LANDING PAGE

La página de inicio es la carta de presentación de la plataforma. Está optimizada para captar el interés de nuevos clientes y facilitar una comunicación directa.

### 3.1. Sección Hero (Presentación)
Ubicada en el extremo superior de la landing page, presenta un diseño atractivo con fondo tecnológico de alto contraste:
* **Título Principal:** "Conectividad de Alto Rendimiento".
* **Subtítulo:** Detalla la disponibilidad de fibra óptica simétrica para hogares y empresas.
* **Botón VER PLANES (Naranja):** Desplaza automáticamente la pantalla hacia abajo hasta la sección de los planes vigentes.
* **Botón SABER MÁS (Borde Blanco):** Desplaza automáticamente la pantalla hacia el formulario de consultas al final de la página.

### 3.2. Grilla de Planes de Fibra Óptica
Muestra tarjetas dinámicas de los planes disponibles directamente obtenidos desde la base de datos:
* **Visualización de Planes:** Cada tarjeta muestra de manera destacada:
  - Nombre del plan (ej. *Plan Fibra Hogar 200M*).
  - Velocidad asignada (ej. *200 Mbps Simétrico*).
  - Categoría de uso (residencial o empresarial).
  - Breve descripción del servicio y sus beneficios.
  - Precio mensual en Soles Peruanos (S/.).
* **Etiqueta MÁS POPULAR (Badge Superior):** Se visualiza de forma automática en aquellos planes destacados por el administrador para llamar la atención del consumidor.
* **Botón CONTRATAR AHORA:**
  - Dirige al usuario al formulario de **Consultas**.
  - Envía de forma automática mediante parámetros de enlace el nombre del plan seleccionado para que el formulario de contacto esté pre-completado con su opción de interés.

### 3.3. Formulario de Consultas y Contacto
Permite a cualquier persona interesada ingresar sus datos para solicitar una llamada o correo informativo de un asesor:
* **Campos del Formulario:**
  1. **DNI:** Campo de entrada numérico para el documento nacional de identidad (8 dígitos).
  2. **Nombre Completo:** Espacio para nombres y apellidos del solicitante.
  3. **Correo Electrónico:** Dirección de e-mail de contacto válida.
  4. **Teléfono de Contacto:** Número celular o de telefonía fija.
  5. **Motivo de Consulta / Interés:** Área de texto libre para detallar dudas, preguntas o el servicio exacto que se desea contratar.
* **Botón ENVIAR SOLICITUD:**
  - Al hacer clic, procesa la petición de forma segura e interactúa con la API.
  - Si el sistema está procesando el envío, el botón se deshabilita temporalmente y muestra una animación de carga (**Spinner**) para evitar envíos dobles.
* **Modal de Retroalimentación:**
  - Si el envío tiene éxito, emerge una ventana con un check verde de éxito con el mensaje *"La solicitud de consulta se envió de manera correcta"*.
  - En caso de error técnico o datos inválidos, se muestra una cruz roja con detalles de los errores a corregir. Debe pulsar el botón **Entendido** para cerrar la ventana emergente.

---

## 4. PROCESO DE AUTENTICACIÓN (ACCESO Y REGISTRO)

El sistema cuenta con un portal de autenticación adaptado para resguardar la seguridad de la información de los usuarios y garantizar accesos de acuerdo a roles.

### 4.1. Pantalla de Inicio de Sesión (Login)
Formulario diseñado de manera limpia para un acceso seguro:
* **Campos Requeridos:**
  - **Usuario:** Nombre de usuario asignado al momento de su registro.
  - **Contraseña:** Clave de seguridad (los caracteres se ocultan por privacidad).
* **Alertas de Estado:**
  - Si ingresa credenciales erróneas, aparecerá un cuadro rojo en la parte superior: *"Usuario o contraseña incorrectos"*.
  - Si el ingreso es correcto, se almacenará la sesión localmente y se redirigirá al panel correspondiente de forma instantánea.
* **Botón INICIAR SESIÓN:** Ejecuta la validación y autenticación con el servidor.
* **Enlace "¿No tienes cuenta? Regístrate":** Redirige dinámicamente el formulario hacia el modo de registro para nuevos clientes.

### 4.2. Formulario de Creación de Cuenta (Registro de Clientes)
Diseñado para dar de alta de forma autónoma a nuevos clientes residenciales o empresariales en la base de datos:
* **Datos Solicitados:**
  1. **Nombre Completo:** Nombres y apellidos oficiales que figurarán en su cuenta de servicio.
  2. **DNI (8 dígitos):** Número de identidad oficial para verificación legal de identidad.
  3. **Ubigeo:** Código geográfico estandarizado para la ubicación de la instalación del servicio.
  4. **Zona:** Nombre del sector, distrito, urbanización o vecindario (ej. *San Isidro*, *Los Olivos*).
  5. **Nombre de Usuario:** Identificador único con el que accederá a la plataforma.
  6. **Correo Electrónico:** Correo principal para notificaciones de soporte y cuenta.
  7. **Contraseña:** Clave personalizada de acceso.
* **Botón CREAR CUENTA:**
  - Envía la información al servidor de registro.
  - Al procesar, muestra un spinner indicador de carga.
  - Al completarse con éxito, muestra una alerta verde confirmando el alta y devuelve al usuario de forma automática a la vista de Inicio de Sesión para acceder a su nuevo portal.

---

## 5. MÓDULO DE AUTOSERVICIO DEL CLIENTE (DASHBOARD CLIENTE)

Una vez iniciada la sesión, los clientes acceden a su Panel Privado de Autoservicio, el cual consolida toda su experiencia de usuario sin complicaciones técnicas.

### 5.1. Resumen del Plan Contratado
Tarjeta principal informativa de su conexión activa de fibra óptica:
* **Icono de Router:** Representa visualmente el equipamiento e infraestructura activa.
* **Nombre del Plan:** Muestra el servicio asignado al perfil del usuario.
* **Velocidad de Internet:** Detalla la velocidad simétrica de subida y bajada contratada.
* **Renta Mensual:** Indica el costo fijo recurrente contratado en Soles (S/.).
* **Fecha de Inicio:** Indica el día exacto en que comenzó el servicio activo en formato legible (ej. *12 Dic 2024*).

### 5.2. Herramienta de Test de Velocidad en Tiempo Real
Herramienta de diagnóstico integrada directamente para verificar que la velocidad entregada coincida con la contratada:
* **Botón TEST VELOCIDAD (Color Amarillo con Icono de Velocímetro):**
  - Al hacer clic, abre un modal maximizado (**pantalla completa**) en la interfaz.
  - Integra una conexión en vivo de alto ancho de banda impulsada de manera segura por la tecnología de **Fast.com** (Netflix Benchmark).
  - El usuario puede visualizar las mediciones en vivo de: Mbps de descarga, Mbps de subida, latencia (ping en milisegundos) y fluctuación de la red.
  - Para cerrar el test, basta con hacer clic en el botón con la **X** de la esquina superior derecha o hacer clic fuera del recuadro del modal.

### 5.3. Gestión y Actualización de Perfil
Sección lateral que permite la personalización y actualización de sus datos de contacto de manera autónoma:
* **Campos Modificables:**
  - **Nombre Completo:** Cuadro de texto para corregir o actualizar la firma del usuario titular.
  - **Correo Electrónico:** Lectura y confirmación de la dirección de contacto registrada.
* **Botón GUARDAR CAMBIOS:**
  - Sincroniza y almacena de inmediato las correcciones de perfil en la base de datos central de clientes.
  - Bloquea temporalmente el formulario para evitar modificaciones simultáneas de datos.
* **Botón CAMBIAR CONTRASEÑA:**
  - Abre una ventana modal emergente para renovar la seguridad de la cuenta.
  - Solicita obligatoriamente tres entradas: **Contraseña Actual**, **Nueva Contraseña**, y **Confirmar Nueva Contraseña**.
  - Al pulsar el botón **Actualizar**, el sistema valida que la contraseña actual sea la correcta y que ambas claves nuevas coincidan exactamente antes de aplicar el cambio encriptado.
* **Botón SUBIR FOTO:**
  - Permite al usuario titular de la cuenta seleccionar una imagen desde su computador o dispositivo móvil para guardarla como foto de perfil o imagen de referencia de su domicilio.

### 5.4. Sistema de Tickets de Soporte Técnico
Canal de comunicación directa con el equipo técnico encargado de la estabilidad del servicio:
* **Lista "Mis Tickets":**
  - Muestra un listado ordenado de todas las solicitudes enviadas anteriormente por el cliente.
  - Cada ticket expone: Asunto de la solicitud, descripción breve del inconveniente y un identificador de estado (ej. *ABIERTO*, *PENDIENTE*, *RESUELTO*, *EN PROCESO*).
* **Botón NUEVO TICKET:**
  - Al presionarse, despliega el modal **Generar Nuevo Ticket**.
  - **Asunto:** Entrada de texto breve donde el cliente redacta el título del reporte (ej. *Intermitencia de señal por las tardes*).
  - **Descripción del problema:** Caja de texto amplia para detallar la situación física de los equipos, luces del módem, o comportamientos anómalos detectados.
  - **Botón Enviar Ticket:** Registra el ticket de soporte técnico de inmediato en la cola de asignaciones del equipo administrativo.

---

## 6. MÓDULO DE RESEÑAS Y COMENTARIOS PÚBLICOS

Espacio comunitario de la plataforma destinado a que los visitantes evalúen el rendimiento y dejen constancia de su satisfacción con la fibra óptica de Internet Pro.

### 6.1. Lectura de Reseñas y Calificaciones
* **Tarjeta de Reseña:** Cada opinión de cliente aprobada por moderación presenta:
  - Inicial del nombre del cliente dentro de un círculo con colores corporativos.
  - Nombre del usuario autor.
  - Fecha en que se publicó la reseña.
  - Calificación representada con estrellas amarillas (desde 1 estrella hasta un máximo de 5 estrellas).
  - Texto descriptivo detallando la experiencia del cliente con el servicio.
* **Empty State:** Si aún no existen comentarios aprobados en el sistema, se mostrará el mensaje amigable: *"Aún no hay reseñas aprobadas. ¡Sé el primero!"*.

### 6.2. Publicación de Nuevos Comentarios (Clientes Autenticados)
Formulario interactivo lateral titulado **Danos tu opinión**:
* **Calificación (Menú Desplegable):** Permite elegir una puntuación del 1 al 5 representada por iconos gráficos de estrellas:
  - ⭐⭐⭐⭐⭐ (Excelente)
  - ⭐⭐⭐⭐ (Muy Bueno)
  - ⭐⭐⭐ (Regular)
  - ⭐⭐ (Malo)
  - ⭐ (Muy Malo)
* **Tu Comentario:** Espacio de texto requerido para que el cliente redacte sus opiniones, recomendaciones o agradecimientos de manera detallada.
* **Botón PUBLICAR RESEÑA:**
  - Envía la opinión para ser procesada por el departamento de moderación de contenido antes de ser publicada en el muro público.
  - El botón se bloquea mostrando una animación de procesamiento mientras el sistema registra el comentario.
* **Validación de Sesión:** Si un usuario no está autenticado, el formulario mostrará un mensaje de advertencia en la base: *"Inicia sesión para poder comentar"*, y el botón de publicación permanecerá inhabilitado para evitar spam de cuentas anónimas.

---

## 7. PANEL DE ADMINISTRACIÓN GENERAL (DASHBOARD ADMIN)

Este módulo de control es de acceso exclusivo para usuarios con rol `admin`. Consolida los datos operativos, la base de clientes y la configuración comercial del catálogo de servicios.

### 7.1. KPIs y Indicadores de Gestión Operativa
Ubicados en la parte superior derecha, muestran tres tarjetas de rendimiento automatizadas con colores diferenciados:
1. **Clientes Totales (Borde Azul):** Indica la cifra de cuentas de usuario creadas en el sistema.
2. **Servicios Activos (Borde Verde):** Cantidad de conexiones de fibra óptica activas actualmente.
3. **Tickets de Soporte (Borde Amarillo):** Número de incidencias técnicas sin resolver pendientes de atención.

### 7.2. Barra de Navegación Lateral (Sidebar)
Ubicada al lado izquierdo, permite alternar la vista activa del panel con un solo clic:
* **Resumen Operativo:** Vista global con los KPIs principales.
* **Catálogo de Planes:** Gestión completa de la oferta comercial del ISP.
* **Usuarios & Roles:** Directorio de cuentas del sistema y asignación de permisos.
* **Tickets de Soporte:** Lista global de solicitudes de asistencia técnica para su resolución.
* **Gestión de Consultas:** Bandeja de entrada de solicitudes de información externa de clientes potenciales.
* **Moderación Reseñas:** Bandeja de aprobación de comentarios recibidos.

### 7.3. Sección: Resumen Operativo
* Pantalla inicial que permite un monitoreo general del estado de funcionamiento de la plataforma. Recopila de forma automática la información de las bases de datos de usuarios, soporte y planes activos, brindando una visión gerencial unificada para la toma de decisiones.

### 7.4. Sección: Gestión de Consultas (Leads)
Permite procesar todas las solicitudes enviadas por el formulario de contacto público de la plataforma:
* **Métricas de Sección:** Muestra un indicador dinámico superior que detalla la cantidad de registros por atender (ej. *5 Leads en Cola*).
* **Tabla de Leads:** Muestra una lista interactiva con columnas:
  - **Cliente:** Nombre completo y DNI.
  - **Correo / Teléfono:** Datos de contacto del cliente para fácil acceso.
  - **Fecha:** Día de creación de la consulta en formato de fecha corta.
  - **Asunto:** Extracto del texto del motivo de consulta del cliente.
* **Botón Ver Detalle (Azul):** Abre un cuadro modal con toda la información extendida de la consulta del cliente para su lectura detallada por parte del administrador.
* **Botón Atendido (Verde con Borde):**
  - Al ser seleccionado por el administrador, actualiza de forma instantánea el estado de la consulta a **"atendido"** o **"convertido"**, removiéndola de la lista de pendientes para asegurar un flujo de trabajo ordenado y eficiente.

### 7.5. Sección: Catálogo de Planes (Altas, Bajas y Modificaciones)
Herramienta de administración para definir la oferta comercial que los visitantes y clientes ven en el portal público:
* **Botón Nuevo Plan (Color Azul con Icono +):**
  - Despliega el formulario emergente **Gestión de Plan**.
  - **Nombre del Plan:** Título descriptivo (ej. *Plan Corporativo 1000M*).
  - **Tipo de Plan (Selector):** Permite categorizar entre *residencial* o *empresarial*.
  - **Velocidad:** Especificación técnica simétrica (ej. *1 Gbps*).
  - **Precio (S/.):** Tarifa plana de cobro mensual en soles.
  - **Botón GUARDAR PLAN:** Registra y crea el plan directamente en la base de datos de PostgreSQL, haciéndolo visible de inmediato en la sección pública de planes.
* **Tabla de Planes Actuales:** Presenta el catálogo activo.
* **Botón de Basura / Eliminar (Color Rojo con Icono de Trash):**
  - Ubicado al extremo derecho de cada fila de plan.
  - Al presionarse, lanza un cuadro de diálogo del navegador consultando *"¿Está seguro de eliminar este plan?"*.
  - Al confirmar, el plan se borra de manera permanente de la base de datos central y se actualizan automáticamente las vistas públicas del sistema.

### 7.6. Sección: Visualización de Usuarios y Roles
Muestra la lista de personas registradas en el ecosistema ISP para mantener un control estricto de seguridad:
* **Tabla de Usuarios:**
  - **Usuario:** Nombre único de login registrado por el usuario.
  - **Rol (Badge de Color):** Identifica visualmente si es un usuario administrador (**ADMIN** en badge azul) o un cliente tradicional (**USUARIO** en badge celeste).
  - **Estado:** Badge verde permanente de estado **Activo** para indicar que la cuenta de usuario se encuentra habilitada para operar.

### 7.7. Sección: Gestión y Moderación de Reseñas
Permite controlar las opiniones públicas de la sección de comentarios para evitar spam, lenguaje ofensivo o fraudes en la plataforma:
* **Lista de Moderación:**
  - Muestra tarjetas de comentarios que han sido ingresados por los usuarios en la web pública pero que aún no han sido autorizados para mostrarse.
  - Incluye: Nombre de usuario, tipo de cliente, plan del servicio que tiene contratado, cantidad de estrellas calificadas, fecha del comentario y la descripción detallada de su experiencia.
* **Botón APROBAR (Color Verde Sólido):**
  - Autoriza el comentario.
  - Al presionarlo, el estado cambia a "aprobado", desaparece de la lista de moderación y se publica de forma automática en la página pública de comentarios para todos los visitantes.
* **Botón RECHAZAR (Borde Rojo):**
  - Deniega la publicación del comentario.
  - Al presionarlo, el estado se actualiza a "rechazado", se oculta de forma permanente de las listas públicas y se elimina de la bandeja de entrada del moderador.

---

## 8. RESOLUCIÓN DE PROBLEMAS FRECUENTES

Guía rápida para la solución de incidentes operacionales comunes dentro del uso diario de la plataforma web:

1. **Intento iniciar sesión pero se queda cargando de manera infinita:**
   - *Solución:* Asegúrese de que su conexión de internet local sea estable. Si el problema persiste, es probable que el servidor del backend de ISP Internet Pro se encuentre en mantenimiento. Por favor intente más tarde.
2. **Registro una nueva cuenta y me dice "DNI duplicado" o "Nombre de usuario ya existe":**
   - *Solución:* Cada usuario en la plataforma debe tener un DNI y un nombre de usuario único. Intente registrarse utilizando un identificador de usuario diferente o contacte al administrador si cree que su número de documento de identidad fue registrado por error.
3. **Al enviar un ticket o consulta no aparece el modal de éxito:**
   - *Solución:* Revise que todos los campos del formulario requeridos estén correctamente llenados y que los formatos de datos (como el correo electrónico y el DNI de 8 dígitos) sean válidos. El botón no procesará formularios incompletos.
4. **Como Administrador, doy de alta un Plan nuevo pero no se ve en la Landing Page principal:**
   - *Solución:* Asegúrese de haber presionado el botón **GUARDAR PLAN** y haber recibido el modal verde de confirmación *"Los cambios en el plan se han persistido en la BD"*. Refresque el navegador público para visualizar la actualización del catálogo de servicios.
5. **No puedo ver el Test de Velocidad completo en mi dispositivo móvil:**
   - *Solución:* La herramienta de diagnóstico de Fast.com utiliza marcos responsivos para adaptarse. Si experimenta problemas de visualización, gire su pantalla en posición horizontal para optimizar el espacio visual de la prueba de rendimiento de fibra óptica.

---

*Fin del Manual de Usuario.*
*Diseñado profesionalmente para optimizar la experiencia del usuario y simplificar la gestión operativa de fibra óptica de Internet Pro.*

# Servicio de consulta y actualización vía Web Service para AbsysNET

La información contenida en este documento está sujeta a modificaciones sin previo aviso. Ninguna parte de este documento puede ser reproducida o transmitida de ninguna forma, ni por ningún medio, ya sea electrónico o mecánico, con ningún propósito, sin la previa autorización por escrito de Baratz Servicios de Teledocumentación S.A.U.

© 2022 Baratz Servicios de Teledocumentación S.A.U. Reservados todos los derechos.

AbsysNet es una marca registrada de Baratz Servicios de Teledocumentación S.A.U.

Windows es una marca comercial de Microsoft Corporation

Introducción ..... 3    
¿Qué es el servicio web de consulta y actualización? ..... 3    
Componentes ..... 3    
Configuración del servicio web ..... 3    
Configuración de roles ..... 4    
Operaciones ..... 7    
Acciones ..... 7    
Cómo realizar peticiones SOAP/XML ..... 8    
Cómo realizar búsquedas en la base de datos relacional ..... 8    
Cómo añadir registros en la base de datos relacional ..... 18    
Cómo modificar registros en la base de datos relacional ..... 20    
Cómo eliminar registros en la base de datos relacional ..... 22    
Cómo renovar préstamos ..... 24    
Cómo añadir una petición ..... 26    
Cómo eliminar una petición ..... 28    
Cómo buscar mostradores ..... 30    
Cómo reservar un ejemplo ..... 33    
Cómo anular una reserva ..... 35    
Cómo realizar búsquedas en la base de datos documental ..... 37    
Cómo realizar peticiones RESTFUL/JSON ..... 40    
Cómo realizar búsquedas en la base de datos relacional ..... 40    
Cómo añadir registros en la base de datos relacional ..... 47    
Cómo modificar registros en la base de datos relacional ..... 49    
Cómo eliminar registros en la base de datos relacional ..... 51    
Cómo renovar préstamos ..... 53    
Cómo añadir una petición ..... 56    
Cómo eliminar una petición ..... 59    
Cómo buscar mostradores ..... 61    
Cómo reservar un ejemplo ..... 63    
Cómo anular una reserva ..... 66    
Cómo realizar búsquedas en la base de datos documental ..... 68

### ¿Qué es el servicio web de consulta y actualización?

Es un mecanismo que permite la conexión, vía web, a las bases de datos de AbsysNet, tanto relacionales como documentales, para realizar búsquedas y, de forma restringida realizar altas, bajas y modificaciones.

#### Componentes

El servicio de consulta y actualización está integrado por un servicio web escrito en Java, desplegado en el servidor de aplicaciones (Tomcat o similar), y de un binario residente en el servidor AbsysNet que resuelve propiamente la petición. En este sentido, se trata de una arquitectura en tres capas, similar a la que tiene, por ejemplo, el módulo de opac web de AbsysNet.

<div style="text-align: center;"><img src="https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//46dc3eee-061a-4d05-bc74-bb277fbcb517/markdown_2/imgs/img_in_image_box_191_677_999_829.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-16T11%3A26%3A30Z%2F-1%2F%2F7aa42606ee85ccbd9002c8c48163ec6de4938df79f002634d74ad3313aae8903" alt="Image" width="67%" /></div>


El servicio web recibe las peticiones y las envía al servidor de AbsysNet, donde el programa abnetserv espera escuchando por un puerto que se establece en la configuración. El servidor arranca el ejecutable abnetws en un proceso aparte, que finaliza al atender la petición.

### Configuración del servicio web

El servidor de AbsysNet escucha por un puerto especificado en el fichero de configuración absysNET.xml:

<webservice checkuser=" checkreaderpass=">

<port value="8000"/>

</webservice>

en checkuser, se indica si es necesario que exista un usuario identificado para realizar las peticiones; los valores posibles son los siguientes:

O: no es necesario un usuario identificado

## 1: es necesario un usuario identificado

- en checkreaderpass, se indica si es necesario que el lector introduzca su contraseña para realizar alguna acción; los valores posibles son los siguientes:

O: la contraseña del lector no es obligatoria

1: la contraseña del lector es obligatoria

• en port value, se indica cuál va a ser el puerto de comunicación con el webservice

- el valor por defecto es 8000

En el fichero config.properties del servidor de aplicaciones se indica el puerto y el servidor de AbsysNet con el que va a interactuar el webservice:

SERVER=nombre o dirección IP del servidor de AbsysNet

PORT=puerto de escucha

### Configuración de roles

El control de acceso para las diferentes acciones que se pueden realizar se determina mediante un sistema de roles que se definen en el fichero Admin/abnetws.xml.

El sistema de roles sólo se aplica si existe la entrada checkuser="1" en el fichero absysNET.xml

Internamente se usan siempre usuarios de tipo OPAC. Los roles no se corresponden con usuarios de AbsysNet.

La estructura del fichero abnetws.xml es la siguiente:

- en la etiqueta <role name= password/> se indica el nombre y la contraseña del rol que se está definiendo

en <table name= > se indica el nombre de la tabla y los accesos permitidos para el rol. Las opciones posibles son las siguientes:

search búsqueda y recuperación de datos

○ add añadir

☐ modify modificar

delete borrar

o circulation para PRESTA (renovar préstamos, añadir peticiones y eliminar peticiones). MOSPRE (mostradores de préstamo) y RESERV (añadir y eliminar reservas)

Si se traen resultados de varias tablas embebidas (como las COPIAS de TITULO), es necesario activar la opción  $ search $ de las tablas subordinadas o no aparecerán

Ejemplo:

<?xml version="1.0" encoding="ISO-8859-1"?>

<abnetws>

<roles>

 $$ \begin{aligned}&<role\ name=accesso1\\&password=accesso1\\><tables>\\&\quad<table\ name=USUARI\\&\quad\quad\quad\quad search=1\\&\quad\quad\quad\quad add=1\\&\quad\quad\quad\quad modify=1\\&\quad\quad\quad\quad delete=11/>\\&\quad\quad\quad<table\ name=LECTOR\\&\quad\quad\quad\quad search=1\\&\quad\quad\quad\quad add=0\\&\quad\quad\quad\quad modify=0\\&\quad\quad\quad\quad delete=01/>\\&\quad\quad\quad<table\ name=COPIAS\\&\quad\quad\quad\quad search=11/>\\&\quad\quad\quad<table\ name=PRESTA\\&\quad\quad\quad\quad search=11\\&\quad\quad\quad\quad circulation=11/>\\&\quad\quad\quad<table\ name=MOSPRE\\&\quad\quad\quad\quad search=11\\&\quad\quad\quad\quad circulation=11/>\\&\quad\quad<table\ name=RESERV\\&\quad\quad\quad\quad search=11\\&\quad\quad\quad\quad circulation=11/>\\&</tables>\\<bases>\\&\quad<base\ name=CATA\\&\quad\quad\quad\quad search=11/>\\</bases>\\</role>\\</roles>\\</abnetws>\\\end{aligned} $$ 

A continuación, se explica cómo activar los roles en las peticiones.

##### • Peticiones SOAP/XML

En el caso de peticiones SOAP/XML hay que incluir en la cabecera de la petición la autenticación del rol

El rol y su contraseña se indican de forma encriptada en la entrada Authorization: Basic que hay que añadir en la cabecera del mensaje

1. El nombre del usuario y la contraseña se combina con dos puntos (:) para conseguir la cadena que luego se va a encriptar. Por ejemplo: rol:rol

2. La cadena (rol:rol) se codifica en una secuencia de octetos

3. La cadena resultante se codifica utilizando Base64

##### Ejemplo:

Authorization: Basic QWxhZGRpbfjpPcGVuU2VzYW1I

##### • Peticiones RESTFUL/JSON

En el caso de peticiones RESTFUL/JSON, se puede utilizar una de estas 2 opciones:

1. Incluir en la cabecera de la petición la autenticación del rol

- El rol y su contraseña se indican de forma encriptada en la entrada Authorization: Basic que hay que añadir en la cabecera del mensaje

El nombre del usuario y la contraseña se combina con dos puntos (:) para cosneguir la cadena que luego se va a encriptar. Por ejemplo: rol:rol

- La cadena (rol:rol) se codifica en una secuencia de octetos

- La cadena resultante se codifica utilizando Base64

Ejemplo:

Authorization: Basic QWxhZGRpbpjpPcGVuU2VzYW1I

2. Incluir en el fichero config.properties el nombre y contraseña del rol que se va a utilizar en las peticiones. Las entradas que hay que añadir son las siguientes:

USER=PASS=

Este usuario también tiene que estar dado de alta como rol en el fichero abnetws.xml

o La aplicación utilizará para la conexión el usuario definido en el fichero config.properties si no existe ninguno en la cabecera de la petición

### Operaciones

Existen dos formas de realizar operaciones con el WebService:

1. Implementación de una única operación (GenericOperation) que atiende a todas las acciones previstas. A esta operación se le pasa como parámetro una cadena de texto que en realidad es un documento XML/SOAP con la acción concreta y sus parámetros. La respuesta también viene en la forma de documento XML embebido en una cadena de texto (msg).

Los documentos de entrada y salida dependen de las acciones que se ejecuten.

2. Implementación de una operación que se corresponde con una petición GET y/o POST (application/x-www- form-urlencoded, es decir, como si saliera de un formulario) que incluye un único parámetro.

La respuesta se devuelve en JSON

#### Acciones

Las acciones que se pueden realizar son las siguientes:

Base de datos relacional

- Búsquedas

- Añadir

- Modificar

- Eliminar

Renovar préstamos

- Añadir peticiones

- Eliminar peticiones en estado R-Petición

- Reservar

- Anular reservas no activas

Base de datos documental

- Búsquedas

# Cómo realizar peticiones SOAP/XML

# Cómo realizar búsquedas en la base de datos relacional

#### Documento de entrada:

<?xml version="5.0" encoding="utf-8"?>
<search_tab/a _start_position="posicion de inicio" max_records="máximo número de registros que se envía" description="1" empty_fields="0" secondary="1">
<campo><![CDATA[valor]]></campo>
<campo><![CDATA[valor]]></campo>
</search_tab/a>

El valor tabla se sustituye por la tabla de absysNET que se quiera consultar (p.e. search_lector).

Cualquier tabla es válida.

El valor campo se sustituye por cualquier de los campos de la tabla seleccionada (p.e. <leape/>)

Los atributos _start_position y max_records indique el n° de registros que se van a visualizar agrupados.

Sus valores por defecto son 1 y 10 respectivamente. Es decir, se trae los 10 primeros registros de los localizados en la búsqueda.

El atributo description se usa para indicar si se desea que se envíe la descripción del código asociado a la biblioteca, sucursal del registro que devuelve la búsqueda.

Los valores posibles son:

 $$ \textcircled{0}-N o{~s e~e n v i a~l a~d e s c r i p c i o n~d e l~c o d i g o} $$ 

 $$ \mathbf{1-S e e n v i a l a d e s c r i p c i c ión d e l c o d i g o} $$ 

El valor por defecto es 0

#### Ejemplo:

 $$ \begin{aligned}&En una consulta por lector,\\&\ldots\\&<lecobi><![CDATA[BTZ]]>\\&\quad<description><![CDATA[Biblioteca\\&Baratz]]</description>\\&</lecobi>\\ \end{aligned} $$ 

En el atributo photos se indica el acceso a la foto del lector. Los valores posibles son:

0 - No se incluye la foto del lector

1 - Se incluye la foto del lector

- En el atributo barcode se indica si se va a completar el código de barras del lector o del ejemplar con ceros a la izquierda teniendo en cuenta el valor de la primera entrada definida en la etiqueta <mbarcode> del fichero absysNET.xml

0 - No se completa el código de barras

1 - Se completa el código de barras

El atributo empty_fields se indica si se van a enviar o no los campos sin información. Por defecto, es “0” (no se envían).

Los valores posibles son:

0 - No se envían los campos vacíos

1 - Se envía los campos vacíos

El valor por defecto es 0

Los atributos secondary, tertiary y quaternary son opcionales y hacen referencia a la inclusión de registros de otras tablas dentro de los resultados.

- Si el atributo secondary tiene valor 1, se muestra la información de los préstamos asociados al registro localizado.

Este atributo es válido para la búsqueda de lectores

- Si el atributo tertiary tiene valor 1, se muestra la información de los ejemplares asociados al registro localizado.

Este atributo es válido para la búsqueda de préstamos

- Si el atributo quaternary tiene valor 1, se muestra la información del título asociado al registro localizado.

Este atributo es válido para la búsqueda de ejemplares

El valor por defecto para estos tres atributos es 0

Ejemplo:

Si se activan estos atributos en la búsqueda de lectores, se obtiene la siguiente información:

- préstamos asociados

- información de los ejemplares asociados a los préstamos del lector

- información del título asociado a cada ejemplar

Los valores que se pueden introducir para realizar la búsqueda:

- Valores exactos

Se admiten los comodines * y ? para textos

- Fechas en formato dd/mm/yyyy

Para realizar búsquedas por fechas, hay que utilizar la siguiente nomenclatura:

fecha/ - fecha a partir de la que se realiza la búsqueda (>=)

fecha- fecha hasta la que se realiza la búsqueda ;(<=)

fecha_inicial/fecha_final: la búsqueda devuelve los registros que estén entre el rango de fechas introducido

- Números

Para realizar búsquedas en campos numéricos, hay que utilizar la siguiente nomenclatura:

número/ - números mayores o iguales (>=)

número- números menores o iguales ;(<=)

- Búsqueda con varios valores en un campo, utilizando el tabulador como carácter separador entre los valores que se desean recuperar

- Búsqueda de registros que no contengan información en un determinado campo, utilizando !

- Búsqueda de campos que contengan información en un determinado campo, utilizando *

##### Ejemplos:

<?xml version="5.0" encoding="utf-8"?>
<search_lector _start_position="1" max_records="100" >
<lefcad><![CDATA[|01/01/2016]]></lefcad>
<leemac><![CDATA[!]></leemac>
</search_lector>

A continuación, se puede ver la  $ \underline{\text{petición SOAP}} $ completa:

<?xml version="5.0" encoding="UTF-8"?>
<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope"/>
<S:Header/>
<S:Body>
<ns2:operation xmlns:ns2="http://es.baratz.absysNET"/>
<parameter>
<?xml version="5.0" encoding="utf-8"?>
<search_lector>
<lenlec><![CDATA[100001]]></lenlec>
<lepass><![CDATA[12345btz]]></lepass>
</search_lector>
</parameter>
</ns2:operation>
</S:Body>
</S:Envelope>

#### Documento de respuesta:

 $$ \begin{aligned}&<?xml~version="5.0"encoding="utf-8”？>\\ &\begin{aligned}\\ &<response~code="código~de~retorno"description="descripción~del~resultado"\\&\quad count="número de registros encontrados">\\&\quad<tabla~index="índice del registro en la búsqueda">\\&\quad<campo><![CDATA[valor]]></campo>\\&\quad....\\&\quad</tabla>\\&\quad<tabla~index="índice del registro en la búsqueda">\\&\quad<campo><![CDATA[valor]]></campo>\\&\quad....\\&\quad</tabla>\\&\quad....\\</response>\\ &\end{aligned}\\ \end{aligned} $$ 

El atributo  $ \underline{\text{code}} $ indica si se ha procesado la petición o si ha habido un error. Los valores posibles para esta entrada son:

0 Operación completada con éxito.

1 El servicio web no ha conseguido una respuesta del servidor.

2 El documento de entrada no es válido.

3 No se ha podido procesar la petición.

4 El proceso abnetws se ha cerrado. (Número de usuarios excedidos u otro error).

El atributo subcode indica el error por el que no se ha podido procesar la petición.

Los valores posibles para esta entrada son:

1 Operación completada con éxito.

2 Operación no válida.

3 Tabla relacional no válida.

5 No se han enviado datos para realizar la consulta

6 Datos no válidos

7 Datos no autorizados (consultas por campos que no son de las tablas)

8 Datos no reconocidos (consultas por campos que no existen)

El atributo description informa de forma detallada de la causa por la que no se ha podido procesar la petición.

El atributo count indica el número de registros encontrados en la consulta.

El atributo  $ \underline{\text{index}} $ indica la posición que ocupa el registro dentro de la búsqueda.

El atributo expired indica si el lector está caducado. Los valores posibles son los siguientes:

0 No caducado

1 Caducado

El atributo suspended indica si el lector está suspendido. Los valores posibles son los siguientes:

0 No caducado

1 Caducado

El atributo loan_return_date_exceeded indica si el lector tiene préstamos sobrepasados. Los valores posibles son los siguientes:

0 No tiene préstamos sobrepasados

1 Tiene préstamos sobrepasados

El atributo pending_debt indica si el lector ha superado la deuda permitida para su tipo de lector. Los valores posibles son los siguientes:

0 No ha superado la deuda permitida

1 Ha superado la deuda permitida

En el atributo photo se indica el acceso a la foto del lector. Para que se incluya esta información, es necesario:

1. Incluir la entrada photos='1' en la petición

2. Indicar en la entrada <metsOpac value=""/> del fichero absysNET.xml la ruta de acceso a la foto del lector. Por ejemplo,

<metsOpac value="http://servidor/cgi-bin/opac"/>

El atributo count_secondary indica el n° de registros dependientes del que se está devolviendo.

#### Ejemplo:

Si se han buscado lectores y sus préstamos asociados, en esta entrada se indica el nº de préstamos que tiene el lector

El atributo lent. asociado a la búsqueda por ejemplar, indica si está o no prestado.

Los valores posibles son los siguientes:

0 - No está prestado

1 - Está prestado

El atributo reserved, asociado a la búsqueda por ejemplar, indica si está o no reservado.

Los valores posibles son los siguientes:

0 - No está reservado

1 - Está reservado

El atributo available, asociado a la búsqueda por ejemplar, indica si está o no disponible.

Los valores posibles son los siguientes:

0 - No está disponible

1 - Está disponible

El atributo renewable, asociado a la búsqueda por ejemplar, indica si se puede renovar o no

Los valores posibles son los siguientes:

0 - No se puede renovar

1 – Se puede renovar

A continuación, se puede ver la  $ \underline{\text{respuesta SOAP}} $ en el caso de lector encontrado:

<?xml version="5.0" encoding="UTF-8"?>
<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope"/>
<S:Body>
    <ns2:operationResponse xmlns:ns2="http://es.baratz.absysNET"/>

<return>

<msg>

<?xml version="5.0" encoding="UTF-8"?>

<response count="1" code="0" description="Search operation: OK (table 'lector').">

<lector index="1" expired="0" suspended="0" loan_return_date_exceeded="0" pending_debt="0" photo="">

<lenlec><![CDATA[100001]]>

</lenlec>

<lefsad><![CDATA[2011-12-02 09:39:30]]>

</lefsad>

<leusad><![CDATA[usuario20]]>

</leusad>

<lefsmd><![CDATA[2012-05-10 14:21:36]]>

</lefsmd>

<leusmd><![CDATA[usuario20]]>

</leusmd>

<lecobi><![CDATA[BTZ]]>

</lecobi>

<lecosu><![CDATA[MAD]]>

</lecosu>

<lebasi><![CDATA[0]>

</lebasi>

<leapel><![CDATA[0]]>

</leapel>

<leinic><![CDATA[A.]]>

</leinic>

<lenomb><![CDATA[A.]]>

</lenomb>

<ledi11><![CDATA[A.]]>

</ledi11>

<ledi12><![CDATA[A.]]>

</ledi12>

<ledi13><![CDATA[A.]]>

</ledi13>

<lemail><![CDATA[aaa.aaaa@micorreo.es]]>

</lemail>

<leemac><![CDATA[1]]>

</leemac>

<lecolp><![CDATA[AD]]>

</lecolp>

<leadul><![CDATA[0]>

</leadul>

<lecol1><![CDATA[MUJ]]>

</lecol1>

<lefult><![CDATA[2012-04-27 00:00:00]>

</lefult>

<lefreg><![CDATA[2011-12-02 00:00:00]>

</lefreq>

<lediso><![CDATA[5]]>

</lediso>

<lencar><![CDATA[O]]>

</lencar>

<lepass><![CDATA[Y6mIQGvq7n8xM]]>

</lepass>

<learpd><![CDATA[0]]>

</learpd>

<learps><![CDATA[0]]>

</learps>

<learpt><![CDATA[0]]>

</learpt>

<learre><![CDATA[1]]>

</learre>

<lecart><![CDATA[1]]>

</lecart>

<lemess><![CDATA[Mensaje para este lector]]>

</lemess>

<leafact><![CDATA[0.000000]>

</leafact>

<lepagac![CDATA[0.000000]>

</lepaga>

<letext><![CDATA[0.000000]>

</letext>

<lemeci><![CDATA[0.000000]>

</lemeci>

<lensus><![CDATA[5]]>

</lensus>

<lefubi><![CDATA[2012-04-27 00:00:00]>

</lefubi>

<lenpac><![CDATA[16]]>

</lenpac>

<lenpan><![CDATA[0]]>

</lenpan>

<lediz1><![CDATA[28300]]>

</lediz1>

<lencon><![CDATA[30]]>

</lencon>

<lefuco><![CDATA[2012-04-13 00:00:00]>

</lefuco>

<lealia><![CDATA[AnaAgui]]>

</lealia>

</lector>

</response>

</msg>

</return>

</ns2:operationResponse>

</S:Body>

</S:Envelope>

### Cómo añadir registros en la base de datos relacional

##### Documento de entrada:

<?xml version="5.0" encoding="utf-8"?>
<add_tabla>
<campo><![CDATA[valor]]></campo>
<campo><![CDATA[valor]]></campo>
...
</add_tabla>

El valor tabla puede ser sustituido por:

- usuari (usuarios del interfaz profesional).

- lector (lectores).

- copias (ejemplares).

• El valor campo se sustituye por cualquier de los campos de la tabla indicada.

• Los valores de datos posibles son:

- Valores exactos.

- Campos vacíos para nulos.

- Fechas en formato dd/mm/yyyy.

- En cada tabla pueden existir valores que se inicializan por defecto, es decir, se añaden con un valor determinado si no tienen información (p.e. n° de préstamos de un lector...).

#### Documento de respuesta:

<?xml version="5.0" encoding="utf-8"?>
<response code="código de retorno" description="descripción del resultado" número_secuencial="numero secuencial del nuevo registro" |>

• Los valores posibles de code son:

0 Operación completada con éxito.

1 Error: El servicio web no ha conseguido una respuesta del servidor.

2 Error: El documento de entrada no es válido.

3 Error: No se ha podido procesar la petición.

4 Error: El proceso abnetws se ha cerrado. (Número de usuarios excedidos u otro error).

El atributo subcode indica el error por el que no se ha podido procesar la petición.

Los valores posibles para esta entrada son:

1 Operación completada con éxito.

2 Operación no válida.

3 Tabla relacional no válida.

5 No se han enviado datos para realizar la consulta

6 Datos no válidos

7 Datos no autorizados (consultas por campos que no son de las tablas)

8 Datos no reconocidos (consultas por campos que no existen)

El atributo description informa de forma detallada de la causa por la que no se ha podido procesar la petición. (p.e. claves duplicadas)

El número_secuencial que se ha asignado al nuevo registro se devuelve en un atributo cuyo nombre es el del campo correspondiente (por ejemplo, unseq para USUARI).

### Cómo modificar registros en la base de datos relacional

##### Documento de entrada:

<?xml version="5.0" encoding="utf-8"?>
<modify_tabla>
<campo><![CDATA[valor]]></campo>
<campo><![CDATA[valor]]></campo>
...
</modify_tabla>

El valor tabla puede ser sustituido por:

- usuari (usuarios del interfaz profesional).

- lector (lectores).

- copias (ejemplares).

• El valor campo se sustituye por cualquier de los campos de la tabla indicada.

• Los valores de datos posibles son:

- Valores exactos.

- Campos vacíos para nulos.

- Fechas en formato dd/mm/yyyy.

En cada tabla pueden existir valores que se inicializan por defecto, es decir, se añaden con un valor determinado si no tienen información (p.e. n° de préstamos de un lector...).

#### Documento de respuesta:

<?xml version="5.0" encoding="utf-8"?>

<response code="código de retorno" description="descripción del resultado" |>

• Los valores posibles de code son:

0 Operación completada con éxito.

1 Error: El servicio web no ha conseguido una respuesta del servidor.

2 Error: El documento de entrada no es válido.

3 Error: No se ha podido procesar la petición.

4 Error: El proceso abnetws se ha cerrado. (Número de usuarios excedidos u otro error).

El atributo subcode indica el error por el que no se ha podido procesar la petición.

Los valores posibles para esta entrada son:

1 Operación completada con éxito.

2 Operación no válida.

3 Tabla relacional no válida.

5 No se han enviado datos

6 Datos no válidos

7 Datos no autorizados (campos que no son de las tablas)

8 Datos no reconocidos (campos que no existen)

El atributo description informa de forma detallada de la causa por la que no se ha podido procesar la petición.

### Cómo eliminar registros en la base de datos relacional

#### Documento de entrada:

<?xml version="5.0" encoding="utf-8"?>

<delete_tabla>

<campo><![CDATA[ valor]]></campo>

</delete_tabla>

El valor tabla puede ser sustituido por:

- usuari (usuarios del interfaz profesional).

lector (lectores).

- copias (ejemplares).

• El valor de campo es el número secuencial o el código del registro a eliminar.

#### Documento de respuesta:

<?xml version="5.0" encoding="utf-8"?>

<response code="código de retorno" description="descripción del resultado" |>

• Los valores posibles de code son:

0 Operación completada con éxito.

1 Error: El servicio web no ha conseguido una respuesta del servidor.

2 Error: El documento de entrada no es válido.

3 Error: No se ha podido procesar la petición.

4 Error: El proceso abnetws se ha cerrado. (Número de usuarios excedidos u otro error).

El atributo subcode indica el error por el que no se ha podido procesar la petición.

Los valores posibles para esta entrada son:

1 Operación completada con éxito.

2 Operación no válida.

3 Tabla relacional no válida.

5 No se han enviado datos

6 Datos no válidos

No se puede borrar el registro porque tiene información asociada

El atributo description informa de forma detallada de la causa por la que no se ha podido procesar la petición.

#### Cómo renovar préstamos

##### Documento de entrada:

<?xml version="5.0" encoding="utf-8"?>
<circulation_presta secondary="1" terciary="1">
<campo><![CDATA[valor].]></campo>
<lepass><![CDATA[valor]].</lepass>
...
<campo><![CDATA[valor]].</campo>
</circulation_presta>

El valor campo se sustituye por cualquier de los campos que permiten identificar al lector y el ejemplar de forma unívoca para realizar la renovación del préstamo (p.e. lenlec y cobarc)

El campo lepass es obligatorio.

La lógica es la misma que la del Opac y la política de préstamos definida debe permitir realizar la acción desde el Opac).

Los atributos secondary y tertiary son opcionales y hacen referencia a la inclusión de registros de otras tablas dentro de los resultados.

- Si el atributo secondary tiene valor 1, se muestra la información del ejemplar renovado.

- Si el atributo tertiary tiene valor 1, se muestra la información del registro bibliográfico asociado al ejemplar renovado.

El valor por defecto para estos atributos es 0

##### Documento de respuesta:

<?xml version="5.0" encoding="UTF-8"?>
<response count="1" code="0" description=" Circulation operation: OK (table 'presta')." subcode="1" >

• Los valores posibles de code son:

0 Operación completada con éxito.

1 Error: El servicio web no ha conseguido una respuesta del servidor.

2 Error: El documento de entrada no es válido.

3 Error: No se ha podido procesar la petición.

4 Error: El proceso abnetws se ha cerrado. (Número de usuarios excedidos u otro error).

El atributo subcode indica el error por el que no se ha podido procesar la petición.

Los valores posibles para esta entrada son:

12 No se encuentra el lector

13 Lector no válido

14 No se puede renovar el préstamo porque no está prestado

15 No hay política de préstamo válida

16 No hay política de préstamo

17 Contraseña de lector incorrecta

18 No se encuentra el ejemplar

19 Ejemplar con reservas pendientes

20 Ejemplar no prestado

21 No se permite renovar el préstamo

22 No se permite renovar este título

23 No se permite renovar este ejemplar

27 El lector está caducado

El atributo description informa de forma detallada de la causa por la que no se ha podido procesar la petición.

### Cómo añadir una petición

##### Documento de entrada:

<?xml version="5.0" encoding="utf-8"?>
<circulation_presta_add>
<campo><![CDATA[valor]]></campo>
<lepass><![CDATA[valor]]></lepass>
...
<campo><![CDATA[valor]]></campo>
</circulation_presta_add>

El valor campo se sustituye por cualquier de los campos que permiten identificar al lector, el ejemplar y el mostrador de forma unívoca para añadir la petición (p.e. lenlec, cobarc y mpnseq)

El campo lepass es obligatorio.

La lógica es la misma que la del Opac y la política de préstamos definida debe permitir realizar la acción desde el Opac).

#### Documento de respuesta:

<?xml version="5.0" encoding="UTF-8"?>

<response count="1" code="0" description="Circulation operation: (Add) OK (table 'presta')." subcode="1" subcode2="0">

• Los valores posibles de code son:

0 Operación completada con éxito.

1 Error: El servicio web no ha conseguido una respuesta del servidor.

2 Error: El documento de entrada no es válido.

3 Error: No se ha podido procesar la petición.

4 Error: El proceso abnetws se ha cerrado. (Número de usuarios excedidos u otro error).

El atributo subcode indica el error por el que no se ha podido procesar la petición.

Los valores posibles para esta entrada son:

12 No se encuentra el lector

13 Lector no válido

15 No hay política de préstamo válida

16 No hay política de préstamo

17 Contraseña de lector incorrecta

18 No se encuentra el ejemplar

19 Ejemplar con reservas pendientes

24 Este ejemplar está prestado a este lector

27 El lector está caducado

38 No se ha añadido la petición

40 Ejemplar no disponible

41 Mostrador no activo

42 Mostrador no autorizado para petición de préstamo en la misma sucursal

43 Mostrador no autorizado para petición de préstamo en la misma biblioteca

44 Mostrador no autorizado para petición de préstamo desde otra biblioteca

45 Ejemplar en inventario

46 Tipo de préstamo erróneo

El atributo description informa de forma detallada de la causa por la que no se ha podido procesar la petición.

### Cómo eliminar una petición

##### Documento de entrada:

<?xml version="5.0" encoding="utf-8"?>
<circulation_presta_delete>
<campo><![CDATA[valor]]></campo>
<lepass><![CDATA[valor]]></lepass>
...
<campo><![CDATA[valor]]></campo>
</circulation_presta_delete>

El valor campo se sustituye por cualquier de los campos que permiten identificar al lector y el ejemplar de forma unívoca para eliminar la petición (p.e. lenlec, prbarc)

El campo lepass es obligatorio.

Sólo se puede eliminar peticiones cuyo estado sea R-Petición

##### Documento de respuesta:

<?xml version="5.0" encoding="UTF-8"?>

<response count="0" code="0" description="Circulation operation: (Delete) OK (table 'presta')." subcode="1" subcode2="0">

• Los valores posibles de code son:

0 Operación completada con éxito.

1 Error: El servicio web no ha conseguido una respuesta del servidor.

2 Error: El documento de entrada no es válido.

3 Error: No se ha podido procesar la petición.

4 Error: El proceso abnetws se ha cerrado. (Número de usuarios excedidos u otro error).

El atributo subcode indica el error por el que no se ha podido procesar la petición.

Los valores posibles para esta entrada son:

12 No se encuentra el lector

13 Lector no válido

17 Contraseña de lector incorrecta

18 No se encuentra el ejemplar

27 El lector está caducado

36 No se ha eliminado la petición

37 No se ha encontrado el préstamo

40 Ejemplar no disponible

45 Ejemplar en inventario

El atributo  $ \underline{\text{description}} $ informa de forma detallada de la causa por la que no se ha podido procesar la petición.

#### Cómo buscar mostradores

##### Documento de entrada:

<?xml version="5.0" encoding="utf-8"?>

<circulation_mospre_search>

<campo><![CDATA[ valor]]></campo>

<campo><![CDATA[ valor]]></campo>

</ circulation_mospre_search>

El valor campo se sustituye por cualquier de los campos que permiten localizar mostradores válidos para un ejemplar (p.e. cobarc, mpnseq)

##### Documento de respuesta:

<?xml version="5.0" encoding="UTF-8"?>
<response count="3" code="0" description="Circulation operation: OK (table 'mospre')." subcode="1" subcode2="0">
<mospre index="1" >
<mpnseq>
<![CDATA[4]]>
</mpnseq>
<mpfsad>
![CDATA[2018-12-19 10:29:39]]>
</mpfsad>
<mpusad>
![CDATA[baratz]]>
</mpusad>
<mpfsmd>
![CDATA[2018-12-19 10:29:39]]>
</mpfsmd>
<mpusmd>

<![CDATA[baratz]>]
</mpusmd>
<mpcomp>
<![CDATA[MAD]]>
</mpcomp>
<mpcosu>
<![CDATA[BTZ]]>
<description>
![mpcosu](attachment://mpcosu.png)

<![CDATA[BTZ Biblioteca]]>
</description>
</mpposu>

<mpdesc>
<![CDATA[MAD - Mostrador]]>
</mpdesc>
<mpacti>
![mpacti](attachment://mpacti.png)

<![CDATA[1]]>
</mpacti>
<mpmsua>
<![CDATA[1]]>
</mpmsua>
<mpmbia>
<![CDATA[1]]>
</mpmbia>
<mpobia>
![mpobia](attachment://mpobia.png)

</mpobia>

• Los valores posibles de code son:

0 Operación completada con éxito.

1 Error: El servicio web no ha conseguido una respuesta del servidor.

2 Error: El documento de entrada no es válido.

3 Error: No se ha podido procesar la petición.

4 Error: El proceso abnetws se ha cerrado. (Número de usuarios excedidos u otro error).

El atributo subcode indica el error por el que no se ha podido procesar la petición.

Los valores posibles para esta entrada son:

18 No se encuentra el ejemplar

39 No se ha encontrado el mostrador de préstamo

40 Ejemplar no disponible

41 Mostrador inactivo

42 Mostrador no autorizado para petición de préstamo en la misma sucursal

43 Mostrador no autorizado para petición de préstamo en la misma biblioteca

44 Mostrador no autorizado para petición de préstamo desde otra biblioteca

45 Ejemplar en inventario

El atributo description informa de forma detallada de la causa por la que no se ha podido procesar la petición.

### Cómo reservar un ejemplar

##### Documento de entrada:

<?xml version="5.0" encoding="utf-8"?>
<circulation_reserv>
<campo><![CDATA[valor]]></campo>
<lepass><![CDATA[valor]]></lepass>
...
<campo><![CDATA[valor]]></campo>
</circulation_reserv>

El valor campo se sustituye por cualquier de los campos que permiten identificar al lector y el ejemplar de forma unívoca para realizar la reserva (p.e. lenlec y cobarc)

El campo lepass es obligatorio.

La lógica es la misma que la del Opac y la política de préstamos definida debe permitir realizar la acción desde el Opac).

##### Documento de respuesta:

<?xml version="5.0" encoding="UTF-8"?>

<response count="1" code="0" description=" Circulation operation: OK (table 'reserv')." subcode="1" >

• Los valores posibles de code son:

0 Operación completada con éxito.

1 Error: El servicio web no ha conseguido una respuesta del servidor.

2 Error: El documento de entrada no es válido.

3 Error: No se ha podido procesar la petición.

4 Error: El proceso abnetws se ha cerrado. (Número de usuarios excedidos u otro error)

El atributo subcode indica el error por el que no se ha podido procesar la petición.

Los valores posibles para esta entrada son:

12 No se encuentra el lector

13 Lector no válido

15 No hay política de préstamo válida

17 Contraseña de lector incorrecta

16 No hay política de préstamo

18 No se encuentra el ejemplar

27 El lector está caducado

24 Ejemplar ya prestado a este lector

25 El ejemplar está prestado

26 El lector ha superado el máximo de reservas

28 El lector ya tiene una reserva similar

29 El lector ya tiene un préstamo similar

El atributo description informa de forma detallada de la causa por la que no se ha podido procesar la petición.

#### Cómo anular una reserva

##### Documento de entrada:

<?xml version="5.0" encoding="utf-8"?>

<circulation_reserv_delete>

 $$ <campo><![C D A T A[v a l o r]]></c a m p o> $$ 

 $$ <l e p a s s><![C D A T A[v a l o r]]></-l e p a s s> $$ 

<campo><![CDATA[ valor]]></campo>

</circulation_reserv_delete>

El valor campo se sustituye por cualquier de los campos que permiten identificar al lector y el ejemplar de forma unívoca para realizar la anulación de la reserva (p.e. lenlec y renseq)

El campo lepass es obligatorio.

Sólo se pueden anular reservas que no estén activadas

##### Documento de respuesta:

<?xml version="5.0" encoding="UTF-8"?>

<response count="1" code="0" description="Circulation operation: (Delete) OK (table 'reserv')." subcode="1" >

• Los valores posibles de code son:

0 Operación completada con éxito.

1 Error: El servicio web no ha conseguido una respuesta del servidor.

2 Error: El documento de entrada no es válido.

3 Error: No se ha podido procesar la petición.

## 4 Error: El proceso abnetws se ha cerrado. (Número de usuarios excedidos u otro error)

El atributo subcode indica el error por el que no se ha podido procesar la petición.

Los valores posibles para esta entrada son:

12 No se encuentra el lector

13 Lector no válido

17 Contraseña de lector incorrecta

18 No se encuentra el ejemplar

27 El lector está caducado

34 No se ha podido eliminar la reserva

35 No se ha encontrado la reserva

El atributo description informa de forma detallada de la causa por la que no se ha podido procesar la petición.

# Cómo realizar búsquedas en la base de datos documental

#### Documento de entrada:

<?xml version="5.0" encoding="utf-8"?>

<search_base _start_position="posicion de inicio de los bibliográficos"
max_records="máximo número de registros bibliográficos que se envía"
_start_position_secondary="posicion de inicio de los fondos"
max_records="máximo número de registros de fondos que se envía" >

<search><![CDATA[va/or]]></search>

</search_base>

El valor base se sustituye por cualquiera de las bases de datos de de absysnet (CATA, AUTO, CANC, ...)

- Los atributos _start_position y max_records se pueden usar para obtener los registros bibliográficos encontrados por partes. Si no se especifican, sus valores son 1 y 10 respectivamente (se traen los 10 primeros registros).

Los atributos _start_position_secondary y max_records_secondary se pueden usar para obtener los registros de fondos encontrados por partes. Si no se especifican, sus valores son 1 y 10 respectivamente (se traen los 10 primeros fondos de cada bibliográfico). Si se especifica el valor '0' en max_records_secondary no se muestran los fondos.

• En valor se especifica la búsqueda con la sintaxis de BRS.

Los atributos secondary y tertiary son opcionales y hacen referencia a la inclusión de registros de otras tablas dentro de los resultados.

- Si el atributo secondary tiene valor 1 y secondary_tables="copias", se muestra la información de los ejemplares asociados a los registros

- Si el atributo secondary tiene valor 1 y secondary_tables="copias,scolec:absys", se muestra la información de los ejemplares y de los n° de serie en formato absys.

- Si el atributo secondary tiene valor 1 y secondary_tables="copias, scolec:compact", se muestra la información de los ejemplares y de los n° de serie en formato COMPACT

- Si el atributo secondary tiene valor 1 y secondary_tables="copias,scolec:z3971", se muestra la información de los ejemplares y de los n° de serie en formato Z3971

- Si el atributo tertiary tiene valor 1 y tertiary_tables="scofon", se muestra la información de las notas de fondo asociadas a los registros.

#### Documento de respuesta:

<?xml version="5.0" encoding="utf-8"?>
<response code="codigo de retorno" description="descripción del resultado" count="numero de registros bibliográficos encontrados" >
<collection xmlns="http://www.loc.gov/MARC21/slim" xmlns:xsi="http://www.w3.org/2001/XMLSchema.instance" xi:schemaLocation=http://www.loc.gov/MARC21/slim http://www.loc.gov/standards/marcxml/schema/MARC21slim.xsd>
<record type="Bibliographic" titn="número de título" index="índice del registro bibliográfico en la búsqueda" count_secondary="número de fondos del bibliográfico">
<campo_marcxml><![DATA[valor]></campo_marcxml>
<campo_marcxml><![DATA[valor]]></campo_marcxml>
...
<copias index="Índice del registro de fondos del bibliográfico">
    <campo><![DATA[valor]]></campo>
    <campo><![DATA[valor]]></campo>
</corpias>
...
</record>
</collection>
</response>

• Los valores posibles de code son:

0 Operación completada con éxito.

1 Error: El servicio web no ha conseguido una respuesta del servidor.

2 Error: El documento de entrada no es válido.

3 Error: No se ha podido procesar la petición.

4 Error: El proceso abnetws se ha cerrado. (Número de usuarios excedidos u otro error).

El atributo description informa de forma detallada de la causa de que no se haya podido procesar la petición.

El atributo count indica el número de registros bibliográficos encontrados en la consulta.

El atributo count_secondary indica el número de registros de fondos del bibliográfico.

El atributo index es el índice del registro bibliográfico dentro de la búsqueda.

El atributo titn es el número secuencial en la base de datos, que corresponde con el campo tititu de la tabla titulo.

El atributo index es el índice del registro de fondos del bibliográfico.

Los nodos campo_marcxml corresponden a la presentación del documento bibliográfico en formato MARCXML.

El atributo lent, asociado al ejemplar, indica si está o no prestado.

Los valores posibles son los siguientes:

0 No está prestado

1 Está prestado

El atributo reserved, asociado al ejemplar, indica si está o no reservado.

Los valores posibles son los siguientes:

0 No está reservado

1 Está reservado

El atributo available, asociado al ejemplar, indica si está o no disponible.

Los valores posibles son los siguientes:

0 No está disponible

1 Está disponible

# Cómo realizar peticiones RESTFUL/JSON

# Cómo realizar búsquedas en la base de datos relacional

##### Documento de entrada:

<input type="text" name="operation" value="search" />

<input type="text" name="table" value="(" />

<input type="text" name=_secondary" value="1" />

<input type="text" name="campo" value="">

La nomenclatura en modo URL es la siguiente:

http://servidor:8082/AbsysWebServiceRestful/webresources/service?operation=search&table=lector&lenlec=100000&secondary=1

En la entrada operation se indica la operación que se va a realizar. En este caso el valor válido es  $ \underline{\text{search}} $

El valor value del atributo name='table" se sustituye por la tabla de absysNET que se quiera consultar (p.e. search_/ector)

El valor campo se sustituye por cualquier de los campos de la tabla seleccionada (p.e. <leapel>)

El atributo _description se usa para indicar si se desea que se envíe la descripción del código asociado a la biblioteca, sucursal del registro que devuelve la búsqueda.

Los valores posibles son:

0 No se envía la descripción del código

1 Se envía la descripción del código

El valor por defecto es 0

En el atributo _photos se indica el acceso a la foto del lector. Los valores posibles son:

0 No se incluye la foto del lector

1 Se incluye la foto del lector

- En el atributo _barcode se indica si se va a completar el código de barras del lector o del ejemplar con ceros a la izquierda teniendo en cuenta el valor de la primera entrada definida en la etiqueta <mbarcode> del fichero absysNET.xml

0 No se completa el código de barras

1 Se completa el código de barras

El atributo empty_fields se indica si se van a enviar o no los campos sin información.

Los valores posibles son:

0 No se envían los campos vacíos

1 Se envía los campos vacíos

El valor por defecto es 0

Los atributos _secondary, _tertiary y _quaternary son opcionales y hacen referencia a la inclusión de registros de otras tablas dentro de los resultados.

Si el atributo _secondary tiene valor 1, se muestra la información de los préstamos asociados al registro localizado.

Este atributo es válido para la búsqueda de lectores

Si el atributo _tertiary tiene valor 1, se muestra la información de los ejemplares asociados al registro localizado.

Este atributo es válido para la búsqueda de préstamos

Si el atributo _quaternary tiene valor 1, se muestra la información del título asociado al registro localizado.

Este atributo es válido para la búsqueda de ejemplares

El valor por defecto para estos tres atributos es 0

Ejemplo:

Si se activan estos atributos en la búsqueda de lectores, se obtiene la siguiente información:

- préstamos asociados

- información de los ejemplares asociados a los préstamos del lector

- información del título asociado a cada ejemplar

Los valores que se pueden introducir para realizar la búsqueda:

- Valores exactos

Se admiten los comodines * y ? para textos

- Fechas en formato dd/mm/yyyy

Para realizar búsquedas por fechas, hay que utilizar la siguiente nomenclatura:

fecha/- fecha a partir de la que se realiza la búsqueda (>=)

fecha- fecha hasta la que se realiza la búsqueda ;(<=)

fecha_inicial/fecha_final: la búsqueda devuelve los registros que estén entre el rango de fechas introducido

##### - Números

Para realizar búsquedas en campos numéricos, hay que utilizar la siguiente nomenclatura:

número/ - números mayores o iguales (>=)

número- números menores o iguales ;(<=)

número1/número2: rango de números

- Búsqueda con varios valores en un campo, utilizando el %9 como carácter separador entre los valores que se desean recuperar

- Búsqueda de registros que no contengan información en un determinado campo, utilizando %21

- Búsqueda de campos que contengan información en un determinado campo, utilizando *

{response:{count:"1","subcode2":"0","description":"Search operation: OK

(table
'lector')."subcode":"1","code":"0","lector":{"learpd":"4","ledi13":"Madrid","lecart":"2","lediso":"0","lefreg":"2014-10-03","leafact":"0.000000","letitu":"Sra","lencon":"2","leapel":"SánchezGacía","lefren":"2016-09-21","lefult":"2017-06-19","lefubi":"2017-05-25","leusad":"biblio44","leadul":"1","lenpan":"0","lemail":"xxxx@baratz.es","lepaga":"0.000000","lenomb":"P","learre":"0","leusmd":"abnet","lenlec":"666666","index":"1","lebasi":"0","lefsad":"2014-10-03"18:55:13","lefuco":"2017-06-12","lecolp":"LEC","lensus":"0","lecosu":"content":"BTZ","description":"Baratz","lenpac":"12",
"presta":{"prcolp":"LEC","index":"1","prfsad":"2017-06-19 11:37:46","prforc":"0","prnren":"0","prfre":"2017-06-19 11:37:46","prforc":"0","prnren":"0","prfre":"2017-06-19 11:38:16","prorpr":"U","prfult":"2017-06-19 11:38:16","prclas":"D","prlebi":"BTZ","pradul":"1","prcocl":"SL","prlesu":"MAD","prusmd":"abnet","prrere":"0","prppsq":"152","prccop":"PRD","prprsu":"MAD","prrecl":"0","prnec":"666666","prusad":"abnet","prbarc":"1000078","prcosu":"content":"MAD","descriptionn":"Madrid"},"learps":"0","lencar":"0","leemac":"1","learpt":"0","lepass":******,"leconf":"1","count_secondary":"2","leinic":"Dna","lefsmd":"2017-07-07 14:50:38","ledi11":"R","ledi12":"28330","lecobi":"content":"BTZ","description":"Baratz"},"version":"Jul 13 2017 (2.1)"}}

El atributo  $ \underline{\text{code}} $ indica si se ha procesado la petición o si ha habido un error. Los valores posibles para esta entrada son:

0 Operación completada con éxito.

1 El servicio web no ha conseguido una respuesta del servidor.

2 El documento de entrada no es válido.

3 No se ha podido procesar la petición.

4 El proceso abnetws se ha cerrado. (Número de usuarios excedidos u otro error).

El atributo subcode indica el error por el que no se ha podido procesar la petición.

Los valores posibles para esta entrada son:

1 Operación completada con éxito.

2 Operación no válida.

3 Tabla relacional no válida.

5 No se han enviado datos para realizar la consulta

6 Datos no válidos

7 Datos no autorizados (consultas por campos que no son de las tablas)

8 Datos no reconocidos (consultas por campos que no existen)

El atributo description informa de forma detallada de la causa por la que no se ha podido procesar la petición.

El atributo count indica el número de registros encontrados en la consulta.

El atributo  $ \underline{\text{index}} $ indica la posición que ocupa el registro dentro de la búsqueda.

El atributo expired indica si el lector está caducado. Los valores posibles son los siguientes:

0 No caducado

1 Caducado

El atributo suspended indica si el lector está suspendido. Los valores posibles son los siguientes:

0 No caducado

1 Caducado

El atributo loan_return_date_exceeded indica si el lector tiene préstamos sobrepasados. Los valores posibles son los siguientes:

0 No tiene préstamos sobrepasados

1 Tiene préstamos sobrepasados

El atributo pending_debt indica si el lector ha superado la deuda permitida para su tipo de lector. Los valores posibles son los siguientes:

0 No ha superado la deuda permitida

1 Ha superado la deuda permitida

En el atributo photo se indica el acceso a la foto del lector. Para que se incluya esta información, es necesario:

1. Incluir la entrada photos='1' en la petición

2. Indicar en la entrada <metsOpac value=""/> del fichero absysNET.xml la ruta de acceso a la foto del lector. Por ejemplo,

 $$ \langle\mathsf{m e t s O p a c v a l u e}=``http://s e r v i d o r/c g i-b i n/o p a c//\rangle $$ 

El atributo count_secondary indica el nº de registros dependientes del que se está devolviendo.

Ejemplo:

Si se han buscado lectores y sus préstamos asociados, en esta entrada se indica el n° de préstamos que tiene el lector

El atributo lent, asociado a la búsqueda por ejemplar, indica si está o no prestado.

Los valores posibles son los siguientes:

0 No está prestado

1 Está prestado

El atributo reserved, asociado a la búsqueda por ejemplar, indica si está o no reservado.

Los valores posibles son los siguientes:

0 No está reservado

1 Está reservado

El atributo available, asociado a la búsqueda por ejemplar, indica si está o no disponible.

Los valores posibles son los siguientes:

0 No está disponible

1 Está disponible

El atributo renewable, asociado a la búsqueda por préstamos, indica si se puede renovar o no

Los valores posibles son los siguientes:

0 No se puede renovar

1 Se puede renovar

### Cómo añadir registros en la base de datos relacional

##### Documento de entrada:

<input type="text" name="operation" value="add"/>
<input type="text" name="table" value=" " />
<input type="text" name="campo" value=" " />

En la entrada operation se indica la operación que se va a realizar. En este caso el valor válido es  $ add $

El valor value del atributo name="table" puede ser sustituido por:

- usuari (usuarios del interfaz profesional).

- lector (lectores).

• El valor de campo se sustituye por cualquier de los campos de la tabla indicada.

- copias (ejemplares).

Los valores de datos posibles son:

- Valores exactos.

- Fechas en formato dd/mm/yyyy.

- Campos vacíos para nulos.

- En cada tabla pueden existir valores que se inicializan por defecto, es decir, se añaden con un valor determinado si no tienen información (p.e. n° de préstamos de un lector...).

La nomenclatura en modo URL es la siguiente:

http://servidor:8082/AbsysWebServiceRestful/webresources/service?operation=add&table=lector&lenlec=100000&leapel=Sánchez.....

#### Documento de respuesta:

{"response":{"count":"0","subcode2":"0","description":"Modify operation:OK(tablelector）","subcode":"1","code":"0","version":"Jul132017(2.1)}}

• Los valores posibles de code son:

0 Operación completada con éxito.

1 Error: El servicio web no ha conseguido una respuesta del servidor.

2 Error: El documento de entrada no es válido.

3 Error: No se ha podido procesar la petición.

4 Error: El proceso abnetws se ha cerrado. (Número de usuarios excedidos u otro error).

El atributo subcode indica el error por el que no se ha podido procesar la petición.

Los valores posibles para esta entrada son:

1 Operación completada con éxito.

3 Tabla relacional no válida.

2 Operación no válida.

5 No se han enviado datos para realizar la consulta

6 Datos no válidos

7 Datos no autorizados (consultas por campos que no son de las tablas)

8 Datos no reconocidos (consultas por campos que no existen)

El atributo description informa de forma detallada de la causa por la que no se ha podido procesar la petición. (p.e. claves duplicadas)

El número_secuencial que se ha asignado al nuevo registro se devuelve en un atributo cuyo nombre es el del campo correspondiente (por ejemplo, unseq para USUARI).

# Cómo modificar registros en la base de datos relacional

##### Documento de entrada:

<input type="text" name="operation" value="modify"/>

<input type="text" name="table" value=" />

<input type="text" name="campo" value="">

En la entrada operation se indica la operación que se va a realizar. En este caso el valor válido es  $ \text{modify} $

El valor value del atributo name="table" puede ser sustituido por:

- usuari (usuarios del interfaz profesional).

- lector (lectores).

- copias (ejemplares).

• El valor de campo se sustituye por cualquier de los campos de la tabla indicada.

Los valores de datos posibles son:

Valores exactos.

- Campos vacíos para nulos.

- Fechas en formato dd/mm/yyyy.

- En cada tabla pueden existir valores que se inicializan por defecto, es decir, se añaden con un valor determinado si no tienen información (p.e. n° de préstamos de un lector...).

La nomenclatura en modo URL es la siguiente:

http://servidor:8082/AbsysWebServiceRestful/webresources/service?operation=modify&table=lector&lenlec=100000&leapel=Sánchez.....

#### Documento de respuesta:

{"response":{"count":"0","subcode2":"0","description":"Modify operation: OK (table 'lector')","subcode":"1","code":"0","version":"Jul 13 2017 (2.1)"}

• Los valores posibles de code son:

0 Operación completada con éxito.

1 Error: El servicio web no ha conseguido una respuesta del servidor.

2 Error: El documento de entrada no es válido.

3 Error: No se ha podido procesar la petición.

El atributo subcode indica el error por el que no se ha podido procesar la petición.

4 Error: El proceso abnetws se ha cerrado. (Número de usuarios excedidos u otro error).

Los valores posibles para esta entrada son:

1 Operación completada con éxito.

2 Operación no válida.

3 Tabla relacional no válida.

5 No se han enviado datos

6 Datos no válidos

7 Datos no autorizados (campos que no son de las tablas)

8 Datos no reconocidos (campos que no existen)

El atributo description informa de forma detallada de la causa por la que no se ha podido procesar la petición.

### Cómo eliminar registros en la base de datos relacional

#### Documento de entrada:

<input type="text" name="operation" value="delete"/>
<input type="text" name="table" value=" " />
<input type="text" name="campo" value=" " />

En la entrada operation se indica la operación que se va a realizar. En este caso el valor válido es delete

El valor value del atributo name="table" puede ser sustituido por:

- usuari (usuarios del interfaz profesional).

- lector (lectores).

- copias (ejemplares).

• El valor de campo es el número secuencial o el código del registro a eliminar.

La nomenclatura en modo URL es la siguiente:

http://servidor:8082/AbsysWebServiceRestful/webresources/service?operation=delete&table=lector&lenlec=100000

#### Documento de respuesta:

{"response":{"count":"0","subcode2":"0","description":"Delete operation: OK (table 'lector')","subcode":"1","code":"0","version":"Jul 13 2017 (2.1)"}

• Los valores posibles de code son:

0 Operación completada con éxito.

1 Error: El servicio web no ha conseguido una respuesta del servidor.

2 Error: El documento de entrada no es válido.

3 Error: No se ha podido procesar la petición.

4 Error: El proceso abnetws se ha cerrado. (Número de usuarios excedidos u otro error).

El atributo subcode indica el error por el que no se ha podido procesar la petición.

Los valores posibles para esta entrada son:

1 Operación completada con éxito.

2 Operación no válida.

3 Tabla relacional no válida.

5 No se han enviado datos

6 Datos no válidos

9 No se puede borrar el registro porque tiene información asociada

El atributo description informa de forma detallada de la causa por la que no se ha podido procesar la petición.

#### Cómo renovar préstamos

#### Documento de entrada:

 $$ <input~type="text"name="operation"value="circulation/> $$ 

 $$ <input~type="text"name="table"value="presta"/> $$ 

 $$ <input~type="text"~name="lenlec"~value="""/> $$ 

 $$ <input~type="text"name="lepass"value=" " /> $$ 

 $$ <input~type="text"name="cobarc"value=""> $$ 

La nomenclatura en modo URL es la siguiente:

http://servidor:8082/AbsysWebServiceRestful/webresources/service?operation=circulation&table=presta&lenlec=100000&lepass=1234&cobar=10000000

En la entrada operation se indica la operación que se va a realizar. En este caso el valor válido es circulation

En la entrada table se indica la tabla en la que se va a realizar la acción. En este caso el valor presta

Para identificar al lector y al ejemplar es necesario utilizar campos que los identifiquen de forma unívoca (p.e. lenlec y cobarc). Estos campos se indican en diferentes etiquetas tipo name.

El campo lepass es obligatorio.

Ejemplo:

 $$ <input~type="text"name="lenlec"value="100000"/> $$ 

 $$ <input~type="text"name="lepass"value="1234"/> $$ 

 $$ <input~type="text"name="cobarc"value="1000001"/> $$ 

La lógica es la misma que la del Opac y la política de préstamos definida debe permitir realizar la acción desde el Opac).

Los atributos _secondary y _tertiary son opcionales y hacen referencia a la

inclusión de registros de otras tablas dentro de los resultados.

- Si el atributo _secondary tiene valor 1, se muestra la información del ejemplar renovado.

- Si el atributo _tertiary tiene valor 1, se muestra la información del registro bibliográfico asociado al ejemplar renovado.

El valor por defecto para estos atributos es 0

#### Documento de respuesta:

{"response":

{"presta":"{prcolp":"ALU","prcorn":"W","index":"1","prfsad":"2017-07-05
10:18:53","prfsmd":"2017-07-13 13:09:20","prforc":"0","prnren":"2","prfpre":"2017-07-05 10:18:53","prorpr":"U","prfult":"2017-07-13
13:09:20","prclas":"D","prlebi":"BTZ","pradul":"1","prfdev":"2017-08-07
23:59:00","prcoc|":"SL","prusmd":"opac01","prrere":"0","prppsq":"74","prcocp":"PRL","prprsu":"MAD","prrecl":"0","prnlec":"100000","prusad":"abnet","prbarc":"1000000","prosu":"MAD"},count":"1","subcode2":"0","description":"Circulation operation:OK
(table 'presta')."subcode":"1","code":"0","version":"Jul 13 2017 (2.1)"}}

• Los valores posibles de code son:

0 Operación completada con éxito.

1 Error: El servicio web no ha conseguido una respuesta del servidor.

2 Error: El documento de entrada no es válido.

3 Error: No se ha podido procesar la petición.

4 Error: El proceso abnetws se ha cerrado. (Número de usuarios excedidos u otro error).

El atributo subcode indica el error por el que no se ha podido procesar la petición.

Los valores posibles para esta entrada son:

12 No se encuentra el lector

13 Lector no válido

14 No se puede renovar el préstamo porque no está prestado

15 No hay política de préstamo válida

16 No hay política de préstamo

17 Contraseña de lector incorrecta

18 No se encuentra el ejemplar

19 Ejemplar con reservas pendientes

20 Ejemplar no prestado

21 No se permite renovar el préstamo

22 No se permite renovar este título

23 No se permite renovar este ejemplar

27 El lector está caducado

El atributo description informa de forma detallada de la causa por la que no se ha podido procesar la petición.

### Cómo añadir una petición

#### Documento de entrada:

<input type="text" name="operation" value="circulation" />
<input type="text" name="extended" value="add" />
<input type="text" name="table" value="presta" />
<input type="text" name="lenlec" value="//>
<input type="text" name="lepass" value="//>
<input type="text" name="cobarc" value="//>
<input type="text" name="mpnseq" value="//>

La nomenclatura en modo URL es la siguiente:

http://servidor:8082/AbsysWebServiceRestful/webresources/service?operation=circulation&extended=add&table=presta&lenlec=100000&lepass=1234&BARC=10000000&mpnseq=12

En la entrada operación se indica la operación que se va a realizar. En este caso el valor válido es circulation

En la entrada extended se indica la operación específica que se va a realizar.

En este caso el valor válido es  $ add $

En la entrada table se indica la tabla en la que se va a realizar la acción. En este caso el valor presta

Para identificar al lector y al ejemplar es necesario utilizar campos que los identifiquen de forma unívoca (p.e. lenlec y cobarc). Estos campos se indican en diferentes etiquetas tipo name.

El campo lepass es obligatorio.

La lógica es la misma que la del Opac y la política de préstamos definida debe permitir realizar la acción desde el Opac).

#### Documento de respuesta:

{"response":{"prbarc":"1025764","code":"0","subcode2":"0","description":" Circulation operation: (Add) OK (table 'presta')","subcode":"1","version":"Mar 26 2019 WS 5.0 (2.2)}}

• Los valores posibles de code son:

0 Operación completada con éxito.

1 Error: El servicio web no ha conseguido una respuesta del servidor.

2 Error: El documento de entrada no es válido.

3 Error: No se ha podido procesar la petición.

4 Error: El proceso abnetws se ha cerrado. (Número de usuarios excedidos u otro error).

El atributo subcode indica el error por el que no se ha podido procesar la petición.

Los valores posibles para esta entrada son:

12 No se encuentra el lector

13 Lector no válido

15 No hay política de préstamo válida

16 No hay política de préstamo

17 Contraseña de lector incorrecta

18 No se encuentra el ejemplar

19 Ejemplar con reservas pendientes

24 Este ejemplar está prestado a este lector

27 El lector está caducado

38 No se ha añadido la petición

40 Ejemplar no disponible

41 Mostrador no activo

42 Mostrador no autorizado para petición de préstamo en la misma sucursal

43 Mostrador no autorizado para petición de préstamo en la misma biblioteca

44 Mostrador no autorizado para petición de préstamo desde otra biblioteca

45 Ejemplar en inventario

46 Tipo de préstamo erróneo

El atributo description informa de forma detallada de la causa por la que no se ha podido procesar la petición.

### Cómo eliminar una petición

#### Documento de entrada:

<input type="text" name="operation" value="circulation" />
<input type="text" name="extended" value="delete" />
<input type="text" name="table" value="presta" />
<input type="text" name="lenlec" value="//">
<input type="text" name="lepass" value="//">
<input type="text" name="prbarc" value="//">

##### La nomenclatura en modo URL es la siguiente:

http://servidor:8082/AbsysWebServiceRestful/webresources/service?operation=circulation&extended=delete&table=presta&lenlec=100000&lepass=1234&prbarc=10000000

En la entrada operación se indica la operación que se va a realizar. En este caso el valor válido es circulation

En la entrada extended se indica la operación específica que se va a realizar. En este caso el valor válido es delete

En la entrada table se indica la tabla en la que se va a realizar la acción. En este caso el valor presta

Para identificar al lector y al ejemplar es necesario utilizar campos que los identifiquen de forma unívoca (p.e. lenlec y prbarc). Estos campos se indican en diferentes etiquetas tipo name.

El campo lepass es obligatorio.

Sólo se puede eliminar peticiones cuyo estado sea R-Petición

##### Documento de respuesta:

{"response":{"prbarc":"1025764","code":"0","subcode2":"0","description":"Circulation operation: (delete) OK (table 'presta')","subcode":"1","version":"Mar 26 2019 WS 5.0 (2.2)}}

• Los valores posibles de code son:

0 Operación completada con éxito.

1 Error: El servicio web no ha conseguido una respuesta del servidor.

2 Error: El documento de entrada no es válido.

3 Error: No se ha podido procesar la petición.

4 Error: El proceso abnetws se ha cerrado. (Número de usuarios excedidos u otro error).

El atributo subcode indica el error por el que no se ha podido procesar la petición.

Los valores posibles para esta entrada son:

12 No se encuentra el lector

13 Lector no válido

17 Contraseña de lector incorrecta

18 No se encuentra el ejemplar

27 El lector está caducado

36 No se ha eliminado la petición

37 No se ha encontrado el préstamo

40 Ejemplar no disponible

45 Ejemplar en inventario

El atributo description informa de forma detallada de la causa por la que no se ha podido procesar la petición.

#### Cómo buscar mostradores

##### Documento de entrada:

<input type="text" name="operation" value="circulation" />
<input type="text" name="extended" value="search" />
<input type="text" name="table" value="mospre" />
<input type="text" name="cobarc" value=" " />

La nomenclatura en modo URL es la siguiente:

http://servidor:8082/AbsysWebServiceRestful/webresources/service?operation=circulation&extended=search&table=mospre&cobar=10000000

En la entrada operation se indica la operación que se va a realizar. En este caso el valor válido es circulation

En la entrada extended se indica la operación específica que se va a realizar. En este caso el valor válido es  $ \underline{\text{search}} $

En la entrada table se indica la tabla en la que se va a realizar la acción. En este caso el valor  $ mospre $

Para identificar al ejemplar o al mostrdaor es necesario utilizar campos que los identifiquen de forma unívoca (p.e. cobarc y mpnseq). Estos campos se indican en diferentes etiquetas tipo name.

El campo lepass es obligatorio.

Mostradores válidos para realizar peticiones en una sucursal concreta

Ejemplo:

La nomenclatura en modo URL es la siguiente:

http://servidor:8082/AbsysWebServiceRestful/webresources/service?operation=circulation&extended=search&table=mospre&mpcosu=MAD

#### Documento de respuesta:

{"response":{"mospre":"{mpacti":"1","mpusad":"baratz","mpcosu":"MAD","mpmsua":"1","index":"1","mpfsad":"2018-12-1910:29:19","mpnseq":"3","mpcomp":"MAD1","mpdesc":"MAD1-Mostrador","mpmbia":"1","mpobia":"1","mpusmd":"baratz","mpfsmd":"2018-12-1910:29:19","code":"0","subcode2":"0","count":"1","description":"Circulation operation:OK (table 'mospre').","subcode":"1","version":"Mar 26 2019 WS 5.0 (2.2)"}

• Los valores posibles de code son:

0 Operación completada con éxito.

1 Error: El servicio web no ha conseguido una respuesta del servidor.

2 Error: El documento de entrada no es válido.

3 Error: No se ha podido procesar la petición.

4 Error: El proceso abnetws se ha cerrado. (Número de usuarios excedidos u otro error).

El atributo subcode indica el error por el que no se ha podido procesar la petición.

Los valores posibles para esta entrada son:

18 No se encuentra el ejemplar

39 No se ha encontrado el mostrador de préstamo

40 Ejemplar no disponible

41 Mostrador inactivo

42 Mostrador no autorizado para petición de préstamo en la misma sucursal

43 Mostrador no autorizado para petición de préstamo en la misma biblioteca

44 Mostrador no autorizado para petición de préstamo desde otra biblioteca

45 Ejemplar en inventario

El atributo description informa de forma detallada de la causa por la que no se ha podido procesar la petición.

### Cómo reservar un ejemplar

#### Documento de entrada:

<input type="text" name="operation" value="circulation" />
<input type="text" name="table" value="reserv" />
<input type="text" name="lenlec" value=" " />
<input type="text" name="lepass" value=" " />
<input type="text" name="cobarc" value=" " />

La nomenclatura en modo URL es la siguiente:

http://servidor:8082/AbsysWebServiceRestful/webresources/service?operation=circulation&table=reserv&lenlec=100000&lepass=1234&cobar=10000000

En la entrada operation se indica la operación que se va a realizar. En este caso el valor válido es circulation

En la entrada table se indica la tabla en la que se va a realizar la acción. En este caso el valor reserva

Para identificar al lector y al ejemplar es necesario utilizar campos que los identifiquen de forma unívoca (p.e. lenlec y cobarc). Estos campos se indican en diferentes etiquetas tipo name.

El campo lepass es obligatorio.

Ejemplo:

 $$ <input~type="text"name="lenlec"value="100000"/> $$ 

<input type="text" name="lepass" value="1234" />

<input type="text" name="cobarc" value="1000001" />

La lógica es la misma que la del Opac y la política de préstamos definida debe permitir realizar la acción desde el Opac).

#### Documento de respuesta:

{"response":
{"count":"1","reserv":
{"index":"1","refsmd":"2017-07-13
13:14:27","reprio":"9","repspq":"74","recocl":"SL","renseq":"1","renlec":"100000","recocp":"PRL","recosu":"MAD","refsad":"2017-07-13
13:14:27","eresu":"MAD","rencar":"0","recolp":"ALU","resu1md":"opac01","rebarc":"1000000","reorre":"W","rentit":"597","relebI":"BTZ","reffin":"2018-01-09","reusad":"opac01","refcre":"2017-07-13 13:14:27","readul":"1","subcode2":"0",
"description":"Circulation operation: OK (table 'reserv').", "subcode":"1","code":"0","version":"Jul 13 2017 (2.1)"}

• Los valores posibles de code son:

0 Operación completada con éxito.

1 Error: El servicio web no ha conseguido una respuesta del servidor.

2 Error: El documento de entrada no es válido.

3 Error: No se ha podido procesar la petición.

4 Error: El proceso abnetws se ha cerrado. (Número de usuarios excedidos u otro error).

El atributo subcode indica el error por el que no se ha podido procesar la petición.

Los valores posibles para esta entrada son:

12 No se encuentra el lector

13 Lector no válido

15 No hay política de préstamo válida

16 No hay política de préstamo

17 Contraseña de lector incorrecta

18 No se encuentra el ejemplar

27 El lector está caducado

24 Ejemplar ya prestado a este lector

25 El ejemplar está prestado

26 El lector ha superado el máximo de reservas

28 El lector ya tiene una reserva similar

29 El lector ya tiene un préstamo similar

El atributo description informa de forma detallada de la causa por la que no se ha podido procesar la petición.

#### Cómo anular una reserva

#### Documento de entrada:

<input type="text" name="operation" value="circulation" />
<input type="text" name="extended" value="delete" />
<input type="text" name="table" value="reserv" />
<input type="text" name="lenlec" value=" " />
<input type="text" name="lepass" value=" " />
<input type="text" name="renseq" value=" " />

La nomenclatura en modo URL es la siguiente:

http://servidor:8082/AbsysWebServiceRestful/webresources/service?operation=circulation&extended=delete&table=reserv&lenlec=100000&lepass=1234&renseq=22

En la entrada operation se indica la operación que se va a realizar. En este caso el valor válido es circulation

En la entrada extended se indica la operación específica que se va a realizar. En este caso el valor válido es delete

En la entrada table se indica la tabla en la que se va a realizar la acción. En este caso el valor reserva

Para identificar al lector y la reserva a eliminar es necesario utilizar campos que los identifiquen de forma unívoca (p.e. lenlec y renseq). Estos campos se indican en diferentes etiquetas tipo name.

El campo lepass es obligatorio.

Sólo se pueden anular reservas que no estén activadas

#### Documento de respuesta:

{"response":{"code":"0","subcode2":"0","count":"0","description":"Circulationoperation}=(Delete) OK (table reserv).","subcode":"1","version":"Mar 26 2019 WS 5.0(2.2)"}}

• Los valores posibles de code son:

0 Operación completada con éxito.

1 Error: El servicio web no ha conseguido una respuesta del servidor.

2 Error: El documento de entrada no es válido.

3 Error: No se ha podido procesar la petición.

4 Error: El proceso abnetws se ha cerrado. (Número de usuarios excedidos u otro error)

El atributo subcode indica el error por el que no se ha podido procesar la petición.

Los valores posibles para esta entrada son:

12 No se encuentra el lector

13 Lector no válido

17 Contraseña de lector incorrecta

18 No se encuentra el ejemplar

27 El lector está caducado

34 No se ha podido eliminar la reserva

35 No se ha encontrado la reserva

El atributo description informa de forma detallada de la causa por la que no se ha podido procesar la petición.

### Cómo realizar búsquedas en la base de datos documental

Documento de entrada:

<input type="text" name="operation" value="search" />
<input type="text" name="base" value="//>
<input type="text" name="_description" value="//>
<input type="text" name="_secondary" value="//>
<input type="text" name="_secondary_tables" value="//>
<input type="text" name="_tertiary" value="//>
<input type="text" name="_tertiary_tables" value="//>
<input type="text" name="_sql_fields" value="//>
<input type="text" name="_doc_fields" value="//>
<input type="text" name="_doc_order" value="//>
<input type="text" name="_covers" value="1" />
<input type="text" name="search" value="//>

La nomenclatura en modo URL es la siguiente:

http://servidor:8082/AbsysWebServiceRestful/webresources/service?operation=search&base=cata&description=1&secondary=1&secondary_tables=copies%2Cscolec%3Az3971&tertiary=1&tertiary_tables=sucurs&sql_fields=cobarc%2Csucosu%2Csucobi&doc_fields=245%2Cleader&doc_order=LIFO&covers=1&search=camilleri

En la entrada operación se indica la operación que se va a realizar. En el caso de la base de datos documental el único valor válido es search

- En la entrada base se indica la bases de dato de AbsysNet en la que se va a consultar (cata, adqt,canc, ...)

En la entrada _secondary se indica si se va a enviar información de los ejemplares y/o colecciones asociadas a los registros.

Los valores posibles son:

0 no se obtienen

1 se obtienen

El valor por defecto es 0

En la entrada _secondary_tables se indica las tablas que van a activarse al tener _secondary el valor 1.

Los valores posibles son:

copias

scolec:compact (visualización de n° de colecciones en formato compact)

scolec:absys (visualización de n° de colecciones en formato absys)

scolec:z3971 (visualización de n° de colecciones en formato Z3971)

##### Ejemplo:

Para enviar los ejemplares y los números de series de las colecciones en modo compacto:

<input type="text" name="_secondary" value="1" />
<input type="text" name="_secondary_tables" value="copias,scolec:compact" />

• En la entrada _tertiary se indica si se va a enviar información de otras tablas relacionadas con los ejemplares y/o colecciones asociadas a los registros.

Los valores posibles son:

0 no se envían

1 se envían

El valor por defecto es 0

- En la entrada _tertiary_tables se indica las tablas que van a activarse al tener _tertiary el valor 1.

Los valores posibles son los siguientes:

Ejemplares: titulo o sucurs

Colecciones: scofon (por defecto)

Las tablas utilizadas por defecto son:

titulo

scofon

• En la entrada _sql_fields se indican los campos de las tablas que se van a enviar.

En la entrada _description se indica si se desea que se envíe la descripción del código asociado a la biblioteca, sucursal del registro que devuelve la búsqueda

Los valores posibles son:

0 no se envía la descripción

1 se envía la descripción

El valor por defecto es 0

En la entrada _doc_fields se indica los campos de los registros localizados en la búsqueda que se van a enviar.

Ejemplo:

 $$ <input~type="text"name="_doc_fields"value="leader,245"/> $$ 

En la entrada _doc_order se indica el orden en que se van enviar los registros localizados en la búsqueda

Ejemplo:

- Campo T245

 $$ <input~type="text"name="_doc_order"value="T245"/> $$ 

- Campo T245 en orden descendente

 $$ <input~type="text"name="_doc_order"value=-T245/> $$ 

- En la entrada _covers se indica si se va a enviar el n° interno asociado al objeto tipo "portada" asociado a los registros localizados en la búsqueda

Los valores posibles son:

0 no se envía el nº del objeto

1 se envía el nº del objeto

El valor por defecto es 0

• En la entrada _search se indica la búsqueda que se quiere realizar

#### Documento de respuesta:

{"response":{"count":"3","subcode2":"0","description":"Search operation: OK (base 'CATA')","subcode":"1","collection":

{"record":

{[{"index":"1","cover":"32235757","titn":"6102","leader":"000000nam 2200000 i 4500","count_secondary":"1","type":"Bibliographic","datafield":"{tag":"245","ind2":"3","ind1":"0","subfield":[{content":"La agricultura española ante la CEE /","code":"a"},{content":"Director Arturo Camilleri Lapeyre.","code":"c"}]},

"copias":

{"index":"1","count_secondary":"1","available":"1","lent":"0","reserved":"0","sucurs":{"sucobi":"content":"BTZ","description":"Baratz","index":"1","sucosu":"MAD","cobarc":"100096"}},

{"index":"2","cover":"31222323","titn":"6","leader":"00000nam a2200000 c 4500","count_secondary":"2","type":"Bibliographic","datafield":"{tag":"245","ind2":"3","ind1":"1","subfield":[{content":"La luna de papel /","code":"a"},{"content":"Andrea Camilleri ; traducción el italiano, MarAntonia Menini Pag","code":"c"}]},

"copias":

[{``index'':"1",``count_secondary'':"1",``available'':"1",``lent'':"0",``reserved'':"0",``sucurs'':"sucobi'':"``content'':"BTZ",``description'':"Baratz"},``index'':"1",``sucosu'':"MAD"},``cobarc'':"1000094"},

{"index":"2","count_secondary":"1","available":"1","lent":"0","reserved":"0","sucurs":"{su cobi}:{"content":"BTZ","description":"Baratz","index":"1","sucosu":"MAD","index":"1","sucosu":"MAD","cobarc":"1000095"}]},

{"index":"3","titn":"10027","leader":"00000nas a2200000 c 4500",

"scolec":

{"index":"1","z3971":{"base":"N° 1 2017 -"}},

"type":"Bibliographic","datafield":"{tag":"245","ind2":"0","ind1":"0","subfield":[{content":"Sueños de papel :","code":"a]},{"content":"revista literaria de La Carlota","code":"b"}]},"

"xmlns:xsi":http://www.w3.org/2001/XMLSchema-
instance", "xmlns":"http://www.loc.gov/MARC21/slim","xsi:schemaLocation":"http://www
w.loc.gov/MARC21/slim
http://www.loc.gov/standards/marcxml/schema/MARC21slim.xsd","code":"0","version
":"Jul 4 2017 (2.1)"}

• Los valores posibles de code son:

0 Operación completada con éxito.

1 Error: El servicio web no ha conseguido una respuesta del servidor.

2 Error: El documento de entrada no es válido.

3 Error: No se ha podido procesar la petición.

4 Error: El proceso abnetws se ha cerrado. (Número de usuarios excedidos u otro error).

El atributo description informa de forma detallada de la causa de que no se haya podido procesar la petición.

El atributo count indica el número de registros bibliográficos encontrados en la consulta.

El atributo count_secondary indica el número de registros de fondos del bibliográfico.

El atributo index es el índice del registro bibliográfico dentro de la búsqueda.

El atributo titn es el número secuencial en la base de datos, que corresponde con el campo tititu de la tabla titulo.

El atributo index es el índice del registro de fondos del bibliográfico.

Los nodos campo_marcxml corresponden a la presentación del documento bibliográfico en formato MARCXML.

El atributo lent, asociado al ejemplar, indica si está o no prestado.

Los valores posibles son los siguientes:

0 No está prestado

1 Está prestado

El atributo reserved, asociado al ejemplar, indica si está o no reservado.

Los valores posibles son los siguientes:

0 No está reservado

1 Está reservado

El atributo available, asociado al ejemplar, indica si está o no disponible.

Los valores posibles son los siguientes:

0 No está disponible

1 Está disponible


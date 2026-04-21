Casos de Uso (CU)
Caso de Uso 1: Registrar Mascota
CU01 – Registrar Mascota
Actor principal:

Recepcionista

Actores secundarios:

Propietario

Descripción:

Permite registrar una nueva mascota en el sistema junto con su propietario.

Precondiciones:
El usuario debe haber iniciado sesión
El propietario debe estar registrado o registrarse previamente
Flujo principal:
El recepcionista accede al módulo de mascotas
Selecciona “Registrar mascota”
Ingresa los datos de la mascota
Selecciona o registra al propietario
Guarda la información
El sistema valida los datos
El sistema registra la mascota exitosamente
Postcondición:

La mascota queda registrada en la base de datos.

Caso de Uso 2: Agendar Cita
CU02 – Agendar Cita
Actor principal:

Recepcionista

Descripción:

Permite asignar una cita veterinaria a una mascota.

Precondiciones:
La mascota debe estar registrada
El veterinario debe estar disponible
Flujo principal:
El recepcionista ingresa al módulo de citas
Selecciona “Nueva cita”
Busca la mascota
Selecciona veterinario
Define fecha, hora y motivo
Guarda la cita
El sistema confirma el agendamiento
Postcondición:

La cita queda registrada en el calendario.

Caso de Uso 3: Registrar Consulta Clínica
CU03 – Registrar Consulta Veterinaria
Actor principal:

Veterinario

Descripción:

Permite registrar la atención médica realizada a una mascota.

Precondiciones:
La mascota debe existir
La cita debe estar activa o registrada
Flujo principal:
El veterinario accede a la historia clínica
Busca la mascota
Registra síntomas y hallazgos
Añade diagnóstico
Registra tratamiento y observaciones
Guarda la consulta
Postcondición:

La historia clínica queda actualizada.

Caso de Uso 4: Generar Factura
CU04 – Generar Factura
Actor principal:

Recepcionista

Descripción:

Permite generar una factura por servicios prestados.

Precondiciones:
Debe existir una atención registrada
Flujo principal:
El recepcionista accede al módulo de facturación
Selecciona la mascota y el propietario
Selecciona los servicios prestados
El sistema calcula subtotal e impuestos
El recepcionista confirma la factura
El sistema genera la factura
Se imprime o exporta en PDF
Postcondición:

La factura queda registrada con estado pendiente o pagada presencialmente.

Caso de Uso 5: Controlar Inventario
CU05 – Gestionar Inventario
Actor principal:

Administrador

Descripción:

Permite registrar y controlar medicamentos e insumos.

Precondiciones:
Usuario autenticado con permisos
Flujo principal:
El administrador accede al módulo de inventario
Registra nuevo producto o actualiza uno existente
Define cantidad, precio y stock mínimo
Guarda cambios
El sistema actualiza inventario
Postcondición:

El inventario queda actualizado correctamente.
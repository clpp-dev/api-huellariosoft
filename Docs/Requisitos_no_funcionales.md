Requisitos No Funcionales (RNF)

Los requisitos no funcionales describen cómo debe funcionar el sistema.

1. Rendimiento
RNF01
El sistema debe responder a las solicitudes principales en menos de 3 segundos.

RNF02
El sistema debe soportar múltiples usuarios concurrentes sin degradación significativa del rendimiento.

2. Seguridad
RNF03
Las contraseñas deben almacenarse cifradas mediante algoritmos seguros.

RNF04
El sistema debe implementar autenticación segura mediante JWT o sesiones protegidas.

RNF05
El sistema debe cumplir con la Ley 1581 de 2012 sobre protección de datos personales en Colombia.

RNF06
El sistema debe restringir el acceso según roles y permisos.

3. Disponibilidad
RNF07
El sistema debe estar disponible al menos el 99% del tiempo operativo.

RNF08
Debe existir respaldo automático de la base de datos.

4. Usabilidad
RNF09
La interfaz debe ser intuitiva, clara y fácil de usar para personal no técnico.

RNF10
El sistema debe ser responsive y adaptable a computadores, tablets y móviles.

5. Escalabilidad
RNF11
La arquitectura debe permitir agregar nuevos módulos sin afectar el funcionamiento actual.

RNF12
El sistema debe permitir crecimiento en volumen de usuarios y datos.

6. Mantenibilidad
RNF13
El código debe estar estructurado y documentado para facilitar mantenimiento futuro.

RNF14
El sistema debe seguir buenas prácticas de desarrollo y arquitectura modular.

7. Compatibilidad
RNF15
El sistema debe ser compatible con navegadores modernos como Chrome, Edge y Firefox.

8. Tecnología
RNF16
El frontend debe desarrollarse en React con Vite.

RNF17
El backend debe desarrollarse en Node.js con Express.

RNF18
La base de datos debe implementarse en MongoDB.

9. Calidad de la información
RNF19
El sistema debe validar los datos ingresados para evitar registros incompletos o erróneos.

RNF20
La información clínica debe mantenerse íntegra, consistente y trazable.
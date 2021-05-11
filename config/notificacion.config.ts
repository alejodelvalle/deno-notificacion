//Definicion de constantes globales del modulo de notificaciones

//Tipos de notificación
export const tipos = {
	app: 'app',
	email: 'email',
	sms: 'sms'
};

//Estados de la notificación
export const estados = { pendiente: 'pendiente', enviada: 'enviada', leida: 'leida' };

//URL para la confirmación de lectura de la notificación por defecto
export const urlConfirmacion = `${Deno.env.get('APP_HOST')}:${Deno.env.get('APP_PORT')}/v1/notificaciones`;

//SMTP Server
export const smtp = {
	hostname: 'smtp.gmail.com',
	port: 465,
	username: 'saul@cali.gov.co',
	password: 'Correo.2016',
	from: 'saul@gmail.com'
};

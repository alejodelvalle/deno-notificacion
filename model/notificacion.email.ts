import { SmtpClient } from "../../../deps.ts";
import * as notificacionConfig from "../config/notificacion.config.ts";
import { updateEstado } from "./notificacion.model.ts";

const client = new SmtpClient();

const smtpConfig = {
  hostname: notificacionConfig.smtp.hostname,
  port: notificacionConfig.smtp.port,
  username: notificacionConfig.smtp.username,
  password: notificacionConfig.smtp.password,
};

export const enviar = async (notificacion: any) => {
  try {
    console.log(
      `Notificación de tipo email creada, enviando mensaje a ${notificacion.email}...`
    );
    let linkConfirmacion = `<a href='${notificacionConfig.urlConfirmacion}/${notificacion._id}'>Haga clic para ver la información</a>`;
    if (notificacion.linkConfirmacion) {
      linkConfirmacion = notificacion.linkConfirmacion;
    }

    const mensaje = `${notificacion.contenido}<p>${linkConfirmacion}</p>`;
    await client.connectTLS(smtpConfig);
    await client.send({
      from: notificacionConfig.smtp.from, // Your Email address
      to: notificacion.email, // Email address of the destination
      subject: notificacion.titulo,
      content: notificacion.contenido,
      html: mensaje,
    });
    await client.close();
    console.log("Email enviado.");
    //Cambiar el estado de la notificación a enviado
    console.log(notificacion._id.valueOf().toString());
    updateEstado(
      notificacion._id.valueOf().toString(),
      notificacionConfig.estados.enviada,
      "Notificación enviada",
      `${Deno.env.get("APP_HOST")}`
    );
  } catch (error) {
    console.error(error);
  }
};

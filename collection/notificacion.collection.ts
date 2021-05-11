import db from "../../../db/mongodb.ts";
import vs from "https://deno.land/x/value_schema/mod.ts";

export interface NotificacionSchema {
  _id: { $oid: string };
  titulo: string;
  tipo: string;
  email: string;
  telefono: string;
  estado: string;
  contenido: string;
  linkConfirmacion: string; // URL de redirección para la confirmacion de la lectura de la notificación
  expira: Date;
  log: [
    {
      fecha: Date;
      detalle: string;
      origen: string;
    }
  ];
}

export const notificacionSchema = {
  // schema for input
  titulo: vs.string(),
  tipo: vs.string(),
  email: vs.string({ ifUndefined: "" }),
  telefono: vs.string({ ifUndefined: "" }),
  contenido: vs.string(),
  linkConfirmacion: vs.string(),
  expira: vs.string(),
};

export const notificacionCollection = db.collection<NotificacionSchema>(
  "notificacion"
);

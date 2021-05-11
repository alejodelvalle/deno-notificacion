import { Bson } from "../../../deps.ts";
import * as notificacionConfig from "../config/notificacion.config.ts";
import {
  notificacionCollection,
  NotificacionSchema,
} from "../collection/notificacion.collection.ts";
import * as notificacionValidate from "../collection/notificacion.validate.ts";
import * as emailClient from "./notificacion.email.ts";

/**
 * crear una notificacion
 * @param notificacion
 * @returns {esValido: boolean,data : {}}
 */

export const create = async (notificacion: NotificacionSchema) => {
  const notificacionValido: any = notificacionValidate.schema(notificacion);
  const validate = await notificacionValidate.notificacion(notificacionValido);
  notificacionValido.estado = notificacionConfig.estados.pendiente;
  //	notificacion.log = [{ fecha: new Date(), detalle: 'Creación' }];
  if (validate.esValido) {
    const insertId = await notificacionCollection.insertOne(notificacionValido);
    const nuevaNotificacion = await notificacionCollection.findOne({
      _id: insertId,
    });
    if (nuevaNotificacion?.tipo === notificacionConfig.tipos.email) {
      emailClient.enviar(nuevaNotificacion);
    }
    return {
      esValido: validate.esValido,
      data: { ...nuevaNotificacion, creacion: insertId.getTimestamp() },
    };
  }
  return {
    esValido: validate.esValido,
    data: validate.errores,
  };
};

/**
 * obtener notificacion por _id
 * @param _id
 * @returns notificacion
 */

export const getById = async (_id: string) => {
  const validate = await notificacionValidate.id({ _id });
  if (validate.esValido) {
    const notificacion = await notificacionCollection.findOne({
      _id: new Bson.ObjectId(_id),
    });
    if (notificacion) {
      return {
        esValido: validate.esValido,
        data: {
          ...notificacion,
          creacion: new Bson.ObjectId(_id).getTimestamp(),
        },
      };
    }
    return {
      esValido: validate.esValido,
      data: null,
    };
  }
  return {
    esValido: validate.esValido,
    data: validate.errores,
  };
};

/**
 * obtener notificaciones
 */

export const getAll = async () => {
  return await notificacionCollection.find({ titulo: { $ne: null } }).toArray();
};

/**
 * Actualiza el estado de una notificación
 * @param {string} _id
 */
export const updateEstado = async (
  _id: string,
  estado: string,
  modificacion: string,
  origen: string
) => {
  const validate = await notificacionValidate.id({ _id });
  if (validate.esValido) {
    const notificacion: any = await notificacionCollection.findOne({
      _id: new Bson.ObjectId(_id),
    });

    if (notificacion) {
      let log = notificacion.log;
      if (log === undefined) {
        log = [];
      }
      console.log(notificacion);
      log.push({ fecha: new Date(), detalle: modificacion, origen: origen });
      const {
        matchedCount,
        modifiedCount,
        upsertedId,
      } = await notificacionCollection.updateOne(
        { _id: new Bson.ObjectId(_id) },
        [
          {
            $set: {
              log: log,
              estado: estado,
              ultimaModificacion: "$$NOW",
            },
          },
        ]
      );
      console.log(
        `${matchedCount} registro encontrado, ${modifiedCount} registro modificado`
      );
      const updatedNotificacion = await notificacionCollection.findOne({
        _id: new Bson.ObjectId(_id),
      });
      return {
        esValido: validate.esValido,
        data: {
          ...updatedNotificacion,
          creacion: new Bson.ObjectId(_id).getTimestamp(),
        },
      };
    }
    return {
      esValido: validate.esValido,
      data: null,
    };
  }
  return {
    esValido: validate.esValido,
    data: validate.errores,
  };
};

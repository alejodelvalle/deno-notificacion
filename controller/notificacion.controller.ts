import { Response, Request, Body } from "../../../deps.ts";
import { config } from "../../../config/config.ts";
import * as notificacionConfig from "../config/notificacion.config.ts";
import * as notificacionModel from "../model/notificacion.model.ts";

/**
 * Obtiene una notificacion recibiendo como parametro el _id
 * @param _id : string
 */
export const getById = async ({
  params,
  response,
}: {
  params: { _id: string };
  response: Response;
}) => {
  const notificacion = await notificacionModel.getById(params._id);
  if (notificacion?.esValido) {
    if (notificacion.data) {
      response.body = {
        message: config.api.status.ok.message,
        data: notificacion.data,
      };
    } else {
      response.status = config.api.status.notFound.code;
      response.body = { message: config.api.status.notFound.message };
    }
  } else {
    response.status = config.api.status.badRequest.code;
    response.body = {
      message: config.api.status.badRequest.message,
      data: notificacion?.data,
    };
  }
};

/**
 * obtener todas la notificaciones
 * @param {}
 */
export const getAll = async ({ response }: { response: Response }) => {
  response.status = config.api.status.ok.code;
  response.body = {
    message: config.api.status.ok.message,
    notificaciones: await notificacionModel.getAll(),
  };
};

/**
 * crea una notificacion, recibe como parametros un objeto con los datos obligatorios
 * @param {Response} notificacion
 */

export const create = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  if (!request.hasBody) {
    response.status = config.api.status.badRequest.code;
    response.body = { message: config.api.status.badRequest.message };
    return;
  }
  try {
    const body: Body = await request.body();
    const notificacion = await body.value;
    const nuevaNotificacion = await notificacionModel.create(notificacion);
    if (nuevaNotificacion?.esValido) {
      response.status = config.api.status.created.code;
      response.body = {
        message: config.api.status.created.message,
        data: nuevaNotificacion.data,
      };
    } else {
      response.status = config.api.status.badRequest.code;
      response.body = {
        message: config.api.status.badRequest.message,
        data: nuevaNotificacion?.data,
      };
    }
  } catch (error) {
    console.error(error);
    response.status = config.api.status.InternalServerError.code;
    response.body = {
      message: config.api.status.InternalServerError.message,
    };
  }
};

/**
 * confirmar la lectura de una notificación, recibe como parametro el _id y retorna objeto notificación actualizada
 * @param _id
 */

export const confirmarLectura = async ({
  params,
  request,
  response,
}: {
  params: { _id: string };
  request: Request;
  response: Response;
}) => {
  try {
    const updatedNotificacion = await notificacionModel.updateEstado(
      params._id,
      notificacionConfig.estados.leida,
      "Notificación leída",
      request.ip
    );

    if (updatedNotificacion?.esValido) {
      if (updatedNotificacion.data) {
        response.status = config.api.status.ok.code;
        response.body = {
          message: config.api.status.ok.message,
          data: updatedNotificacion.data,
        };
      } else {
        response.status = config.api.status.notFound.code;
        response.body = { message: config.api.status.notFound.message };
      }
    } else {
      response.status = config.api.status.badRequest.code;
      response.body = {
        message: config.api.status.badRequest.message,
        data: updatedNotificacion?.data,
      };
    }
  } catch (error) {
    console.error(error);
    response.status = config.api.status.InternalServerError.code;
    response.body = { message: config.api.status.InternalServerError.message };
  }
};

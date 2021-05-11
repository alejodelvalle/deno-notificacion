import {
  validate,
  InvalidParams,
  required,
  isDate,
  firstMessages,
  isString,
  lengthBetween,
  isIn,
  isEmail,
  isNumeric,
  requiredIf,
} from "../../../deps.ts";
import * as notificacionConfig from "../config/notificacion.config.ts";
import {
  notificacionSchema,
  NotificacionSchema,
} from "../collection/notificacion.collection.ts";
import vs from "https://deno.land/x/value_schema/mod.ts";

/**
 * compara la estructura Json del Objeto notificacion que se recibe con el jsonSchema notificacion definido y devuelve el Objeto en la estrucutra definida
 * esto permite que no se acepte la entrada de campos adicionales o con una estrucutra invalida
 * @param {Object} notificacion<NotificacionSchema>
 * @returns {Object} notificacion<NotificacionVS>
 */
export const schema = (notificacion: NotificacionSchema) => {
  return vs.applySchemaObject(notificacionSchema, notificacion);
};

/**
 * Valida los campos de un Objeto notificación para su posterior registro
 * @param {Object} notificacion - el notificación a validar
 * @param {string} notificacion.titulo - el título de la notificación
 * @param {string} notificacion.tipo - el tipo de notificación [app | email | sms]
 * @param {string} notificacion.email - el email de la notificación, solo aplica para el tipo de notificacion email
 * @param {string} notificacion.estado - el estado de la notificación [pendiente | leída]
 * @param {string} notificacion.contenido - el contenido de la notificación
 * @param {Date} notificacion.expira - la fecha de expiración de la notificación (Date)
 *
 * @returns {Object} Objeto - resultado de la validación
 * @returns {boolean} Objeto.esValido - true o false
 * @returns {boolean} Objeto.errores - {campo: 'detalle del error'}
 */
export const notificacion = async (notificacion: NotificacionSchema) => {
  const rules = {
    titulo: [required, isString],
    tipo: [
      required,
      isString,
      isIn([
        notificacionConfig.tipos.app,
        notificacionConfig.tipos.email,
        notificacionConfig.tipos.sms,
      ]),
    ],
    email: [requiredIf("tipo", "email"), isEmail],
    telefono: [requiredIf("tipo", "sms"), isNumeric, lengthBetween(10, 10)],
    //telefono: [isNumeric, lengthBetween(10, 10)],
    estado: [
      isString,
      isIn([
        notificacionConfig.estados.pendiente,
        notificacionConfig.estados.leida,
      ]),
    ],
    contenido: [required, isString],
    expira: [required, isDate],
  };
  /*  if (notificacion.tipo === notificacionConfig.tipos.email) {
    rules.email.unshift(required);
  }
  if (notificacion.tipo === notificacionConfig.tipos.sms) {
    rules.telefono.unshift(required);
  }*/
  const [esValido, error] = await validate(notificacion, rules, {
    messages: {
      "titulo.required": "El titulo es requerido",
      "titulo.isString": "El titulo no es valido, debe ser de tipo texto",
      "tipo.required": "El tipo es requerido",
      "email.required":
        "El email es requerido para el tipo de notificación por Email",
      "email.isEmail": "El email no tiene un formato válido",
      "telefono.required":
        "El número de teléfono móvil es requerido para el tipo de notificación por SMS",
      "telefono.isNumeric": "El número de teléfono móvil debe ser numérico",
      "telefono.lengthBetween":
        "El número de teléfono móvil no tiene un formato valido",
      "contenido.required": "El contenido es requerido",
      "contenido.isString": "El contenido no es válido, debe ser de tipo texto",
      "expira.required": "La fecha de expiración es requerida",
      "expira.isDate": "La fecha de expiración no es válida",
      // Using function
      isIn: (params: InvalidParams): string => {
        const allowedValues = params.allowedValues.join(" | ");
        return `El valor '${params.value}' no es permitido,  solo se permite uno de estos valores ${allowedValues}`;
      },
      // Use this if you want same message for any rule fail
      // "age": "Usia tidak valid",
    },
  });
  const errores = firstMessages(error);
  return { esValido, errores };
};

export const id = async (notificacion: { _id: string }) => {
  const [esValido, error] = await validate(
    notificacion,
    {
      _id: [required, isString, lengthBetween(24, 24)],
    },
    {
      messages: {
        "_id.required": "El _id es requerido",
        "_id.lengthBetween": "El _id no es valido",
      },
    }
  );
  const errores = firstMessages(error);
  return { esValido, errores };
};

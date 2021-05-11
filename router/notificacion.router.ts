import { Router } from "../../../deps.ts";
import * as notificacionController from "../controller/notificacion.controller.ts";

const notificacionRouter = new Router();

notificacionRouter
  .get("/v1/notificacion", notificacionController.getAll)
  .get("/v1/notificacion/:_id", notificacionController.getById)
  .post("/v1/notificacion", notificacionController.create)
  .put(
    "/v1/notificacion/:_id/confirmar-lectura",
    notificacionController.confirmarLectura
  );

export default notificacionRouter;

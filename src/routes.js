import { Router } from 'express';
import multer from 'multer';

import userController from './app/controllers/UserController';
import sessionController from './app/controllers/SessionController';
import fileController from './app/controllers/FileController';
import providerController from './app/controllers/ProviderController';
import appointmentController from './app/controllers/AppointmentController';
import scheduleController from './app/controllers/ScheduleController';
import notificatiosController from './app/controllers/NotificationController';
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', userController.store);
routes.post('/sessions', sessionController.store);

routes.use(authMiddleware);
routes.put('/users', userController.update);
routes.post('/files', upload.single('file'), fileController.store);
routes.get('/providers', providerController.index);
routes.post('/appointments', appointmentController.store);
routes.get('/appointments', appointmentController.index);
routes.delete('/appointments/:id', appointmentController.delete);

routes.get('/schedule', scheduleController.index);
routes.get('/notifications', notificatiosController.index);
routes.put('/notifications/:id', notificatiosController.update);

export default routes;

import { Router } from 'express';
import multer from 'multer';

import userController from './app/controllers/UserController';
import sessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', userController.store);
routes.post('/sessions', sessionController.store);

routes.post('/files', upload.single('file'), (req, res) => {
  return res.json({ ok: true });
});

routes.use(authMiddleware);
routes.put('/users', userController.update);

export default routes;

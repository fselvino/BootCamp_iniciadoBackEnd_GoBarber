import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  // configurar o multer o local onde sera gravado
  storage: multer.diskStorage({
    // ..sai da pasta config, ..sai da pasta src, entra na pasta tmp, depois em uploads
    // destino dos nossos arquivos
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    // formatar o nome do arquivo de nossa imagem
    filename: (req, file, cb) => {
      // randomBytes recebe dois parametros, o primeiro erro, segundo uma resposta
      crypto.randomBytes(15, (err, res) => {
        if (err) return cb(err);

        // o nome do arquivo vai ficar algo como (wah9mhd76dj.png)
        // o qual sera salvo na pasta temp
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};

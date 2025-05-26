import express from 'express';
import 'dotenv/config';
import User from '../models/User.js';

const router = express.Router();

router.put('/:id', async(req, res) => {
   const userId = req.params.id;
   const data = req.body;

   console.log('Datos a actualizar:', data);
   console.log('ID del usuario:', userId);
   
   try {
    const update = await User.findByIdAndUpdate(userId, data, { new: true });
   
    if(!update) {
        return res.status(404).json({ msg: 'No se encontró el usuario' });
    }

    res.json({ user: update });
   } catch(err) {
    res.status(500).json({ msg: 'Error al actualizar la lista de vídeos' });
   }
})

export default router;
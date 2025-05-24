
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import express from 'express';

const router = express.Router();

router.post('/register', async(req, res) => {
    const { name, username, email, password} = req.body;

    if(!name || !username || !email || !password) {
        return res.status(400).json({
            msg: 'Los datos requeridos para el registro no están completos'
        })
    }

    try {
        //VERIFICAMOS PRIMERO QUE NO EXISTAN EL CORREO Y EL USERNAME
        const existUser = await User.findOne({ username });
        if(existUser) {
            return res.status(400).json({ msg: 'El nombre de usuario ya está en uso.'});
        }

        const existEmail = await User.findOne({ email});
        if(existEmail){
            return res.status(400).json({ msg: 'El correo electrónico ya está registrado con otra cuenta.'});
        }

        //CREAMOS EL NUEVO DOCUMENTO DEL SUUARIO
        const newUser = new User({ name, username, email, password });
        await newUser.save();

        const token = jwt.sign(
            {userId: newUser._id},
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ token, user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            username: newUser.username,
        }});


    } catch(err) {
        console.error(err);
        return res.status(500).json({
            msg: 'Error en el servidor'
        })
    }
});

export default router;
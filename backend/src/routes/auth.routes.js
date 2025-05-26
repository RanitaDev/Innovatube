
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import express from 'express';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const router = express.Router();

router.post('/register', async(req, res) => {
    const { name, username, email, password } = req.body;

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

router.post('/login', async(req,res) => {

    console.log(req.body)

    const password = req.body.password;
    const data = req.body.email || req.body.username;
    
    if(!data || !password) {
        return res.status(400).json({ msg: 'Usuario/Email son obligatorios.'});
    }

    try {

        const user = await User.findOne({
            $or: [{ username: data }, { email: data } ]
        });

        if(!user) {
            return res.status(404).json({ msg: 'El usuario no existe.'});
        }

        if (data.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data)) {
            return res.status(400).json({ msg: 'Correo inválido' });
        }

        //VERIFICAR CONTRASEÑA
        const passMatch = await bcrypt.compare(password, user.password);
        if(!passMatch) {
            return res.status(401).json({ msg: 'La contraseña es incorrecta.'});
        }

        //GENERAMOS EL TOKEN JT
        const token = jwt.sign(
            { 
                userId: user._id,
                name: user.name,
                email: user.email,
                lastName: user.lastName
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        //RETORNAMOS EL TOKEN Y LA INFO DEL USUARIO
        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username
            }
        });

    } catch(err) {
        console.error(err);
        return res.status(500).json({ msg: 'Error en el servidor.'});
    }
});

export default router;
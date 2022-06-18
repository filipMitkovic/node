import express, { Router, Request, Response, NextFunction } from 'express'
import { LoginRequest } from '../model'
import Joi from 'joi'
import db from '../database';
import { generateToken } from '../utils/jwt';


const router: Router = Router();


const schema = Joi.object().keys({
    email: Joi.string().email().min(3).required(),
    password: Joi.string().alphanum().min(3).required()
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.validate(req.body);
    if (validation.error) {
        res.send(validation.error.message)
        return
    }
    const loginReq = req.body as LoginRequest
    try {
        let user = await db.User.findOne({ where: {email: loginReq.email} })
        if (user == null) {
            res.send('User not found');
            return;
        }
        if (user.password != loginReq.password) {
            res.send('Bad credentials!')
            return
        }
        const token = generateToken(user);
        res.send(token)
    } catch (error) {
        console.log(error)
        return
    }
})



export default router
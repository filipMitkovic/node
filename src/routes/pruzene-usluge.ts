import express, { Router, Request, Response, NextFunction } from 'express'
import db from '../database';
import { validateToken } from '../utils/jwt';
import Joi from 'joi'

const router: Router = Router();

router.use(validateToken)

const schema = Joi.object().keys({
    //name: Joi.string().min(1).required(),
    //ProizvodjacId: Joi.number().required()
})

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    let usluge = await db.PruzenaUsluga.findAll();
    res.json(usluge);
})

export default router
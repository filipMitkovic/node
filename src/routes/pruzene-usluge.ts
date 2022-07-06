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
    try {
        let usluge = await db.PruzenaUsluga.findAll({ include: [
            {model: db.Usluga, as: 'usluga'}, 
            {model: db.Vozilo, as: 'vozilo', include: [{ model: db.Model, as: 'model', include: 'proizvodjac'}, {model: db.Korisnik, as: 'korisnik'}]}
        ] });
        res.status(200).json(usluge);
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

export default router
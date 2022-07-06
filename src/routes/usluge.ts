import express, { Router, Request, Response, NextFunction } from 'express'
import db from '../database';
import { validateToken } from '../utils/jwt';
import Joi from 'joi'

const router: Router = Router();

router.use(validateToken)

const schema = Joi.object().keys({
    name: Joi.string().min(3).required(),
    cena: Joi.number().required()
})

router.get('/', async (req: Request, res: Response) => {
    let usluge = await db.Usluga.findAll()
    res.json(usluge)
})

router.get('/:id', async (req: Request, res: Response) => {
    let usluga = await db.Usluga.findOne({ where: {id: req.params.id}})
    res.json(usluga)
})

router.post('/', async (req: Request, res: Response) => {
    const validation = schema.validate(req.body);
    if (validation.error) {
        res.status(400).send(validation.error.message)
        return
    }
    let usluga = await db.Usluga.create({name: req.body.name, cena: req.body.cena})
    res.status(200).json(usluga)
})

router.put('/:id', async (req: Request, res: Response) => {
    const validation = schema.validate(req.body);
    if (validation.error) {
        res.send(validation.error.message)
        return
    }
    let usluga = await db.Usluga.findOne({where: {id: req.params.id}})
    usluga.name = req.body.name
    usluga.cena = req.body.cena
    usluga = await usluga.save();
    res.json(usluga)
})

router.delete('/:id', async (req: Request, res: Response) => {
    await db.Usluga.destroy({where: {id: req.params.id}})
    res.json('Deleted.')
})





export default router
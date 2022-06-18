import express, { Router, Request, Response, NextFunction } from 'express'
import db from '../database';
import { validateToken } from '../utils/jwt';
import Joi from 'joi'

const router: Router = Router();

router.use(validateToken)

const schema = Joi.object().keys({
    email: Joi.string().alphanum().min(3).required()
})

router.get('/', async (req: Request, res: Response) => {
    let proizvodjaci = await db.Proizvodjac.findAll()
    res.json(proizvodjaci)
})

router.post('/', async (req: Request, res: Response) => {
    let proizvodjac = await db.Proizvodjac.create({name: req.body.name})
    res.json(proizvodjac)
})

router.put('/:id', async (req: Request, res: Response) => {
    let proizvodjac = await db.Proizvodjac.findOne({where: {id: req.params.id}})
    proizvodjac.name = req.body.name
    proizvodjac = await proizvodjac.save();
    res.json(proizvodjac)
})

router.delete('/:id', async (req: Request, res: Response) => {
    await db.Proizvodjac.destroy({where: {id: req.params.id}})
    res.json('Deleted.')
})

export default router
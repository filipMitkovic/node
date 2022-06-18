import express, { Router, Request, Response, NextFunction } from 'express'
import db from '../database';
import { validateToken } from '../utils/jwt';
import Joi from 'joi'
import { Model } from '../model'

const router: Router = Router();

router.use(validateToken)

const schema = Joi.object().keys({
    name: Joi.string().min(1).required(),
    ProizvodjacId: Joi.number().required()
})


router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    let modeli = await db.Model.findAll();
    res.json(modeli);
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    let model = await db.Model.findOne({ where: {id: req.params.id} })
    res.json(model);
})

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    await db.Model.destroy({ where: {id: req.params.id} })
    res.json('Deleted');
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.validate(req.body);
    if (validation.error) {
        res.send(validation.error.message)
        return
    }
    const toSave = req.body as Model;
    let model = await db.Model.create(toSave);
    res.json(model);
})





export default router
import express, { Router, Request, Response, NextFunction } from 'express'
import db from '../database';
import { validateToken } from '../utils/jwt';
import Joi from 'joi'

const router: Router = Router();

router.use(validateToken)

const schema = Joi.object().keys({
    name: Joi.string().min(1).required(),
    proizvodjacId: Joi.number().required()
})


router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    let modeli = await db.Model.findAll({ include: 'proizvodjac' });
    res.json(modeli);
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    let model = await db.Model.findOne({ where: {id: req.params.id} })
    res.json(model);
})

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.validate(req.body);
    if (validation.error) {
        res.status(400).send(validation.error.message)
        return
    }
    let model = await db.Model.findOne({ where: {id: req.params.id} })
    model.name = req.body.name
    model.proizvodjacId = req.body.proizvodjacId
    model.save()
    res.status(200).json(model)
})

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    await db.Model.destroy({ where: {id: req.params.id} })
    res.json('Deleted');
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.validate(req.body);
    if (validation.error) {
        res.status(400).send(validation.error.message)
        return
    }
    let model = await db.Model.create({
        name: req.body.name,
        proizvodjacId: req.body.proizvodjacId
    });
    res.json(model);
})





export default router
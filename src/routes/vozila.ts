import express, { Router, Request, Response, NextFunction } from 'express'
import db from '../database';
import { validateToken } from '../utils/jwt';
import Joi from 'joi'

const router: Router = Router();

router.use(validateToken)

const schema = Joi.object().keys({
    tip_goriva: Joi.string().valid('BENZIN', 'DIZEL').required(),
    tip_menjaca: Joi.string().valid('6','5','AUTOMATIK').required(),
    broj_registracije: Joi.number().required(),
    broj_sasije: Joi.number().required(),
    broj_motora: Joi.number().required(),
    boja: Joi.string().required(),
    korisnikId: Joi.number().required(),
    modelId: Joi.number().required()
})

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    let vozila = await db.Vozilo.findAll({ include: ['model', 'korisnik'] })
    res.status(200).json(vozila)
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    let vozila = await db.Vozilo.findOne({ where: {id: req.params.id}, include: ['model', 'korisnik'] })
    res.status(200).json(vozila)
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.validate(req.body);
    if (validation.error) {
        res.status(400).send(validation.error.message)
        return
    }
    let vozilo = await db.Vozilo.create({
        tip_goriva: req.body.tip_goriva,
        tip_menjaca: req.body.tip_menjaca,
        broj_registracije: req.body.broj_registracije,
        broj_sasije: req.body.broj_sasije,
        broj_motora: req.body.broj_motora,
        boja: req.body.boja,
        korisnikId: req.body.korisnikId,
        modelId: req.body.modelId
    });
    res.json(vozilo);
})

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.validate(req.body);
    if (validation.error) {
        res.status(400).send(validation.error.message)
        return
    }
    let vozilo = await db.Vozilo.findOne({where: {id: req.params.id}})
    vozilo.tip_goriva = req.body.tip_goriva
    vozilo.tip_menjaca = req.body.tip_menjaca
    vozilo.broj_registracije = req.body.broj_registracije
    vozilo.broj_sasije = req.body.broj_sasije
    vozilo.broj_motora = req.body.broj_motora
    vozilo.boja = req.body.boja
    vozilo.korisnikId = req.body.korisnikId
    vozilo.modelId = req.body.modelId
    vozilo.save()
    res.json(vozilo);
})

router.delete('/:id', async (req: Request, res: Response) => {
    await db.Vozilo.destroy({where: {id: req.params.id}})
    res.json('Deleted.')
})

export default router
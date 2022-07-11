import express, { Router, Request, Response, NextFunction } from 'express'
import db from '../database';
import { validateToken } from '../utils/jwt';
import Joi from 'joi'

const router: Router = Router();

router.use(validateToken)

const schema = Joi.object().keys({
    first_name: Joi.string().min(3).required(),
    last_name: Joi.string().min(3).required(),
    phone: Joi.number().required()
})

router.get('/', async (req: Request, res: Response) => {
    let korisnici = await db.Korisnik.findAll()
    res.json(korisnici)
})

router.get('/:id', async (req: Request, res: Response) => {
    let korisnik = await db.Korisnik.findOne({ where: {id: req.params.id}})
    res.json(korisnik)
})

router.post('/', async (req: Request, res: Response) => {
    const validation = schema.validate(req.body);
    if (validation.error) {
        res.status(400).send(validation.error.message)
        return
    }
    let korisnik = await db.Korisnik.create({
        first_name: req.body.first_name, 
        last_name: req.body.last_name,
        phone: req.body.phone
    })
    res.status(200).json(korisnik)
})


router.put('/:id', async (req: Request, res: Response) => {
    const validation = schema.validate(req.body);
    if (validation.error) {
        res.send(validation.error.message)
        return
    }
    let korisnik = await db.Korisnik.findOne({where: {id: req.params.id}})
    korisnik.name = req.body.first_name
    korisnik.cena = req.body.last_name
    korisnik.phone = req.body.phone
    korisnik = await korisnik.save();
    res.json(korisnik)
})

router.delete('/:id', async (req: Request, res: Response) => {
    await db.Korisnik.destroy({where: {id: req.params.id}})
    res.json('Deleted.')
})



export default router
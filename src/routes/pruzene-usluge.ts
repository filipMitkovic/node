import express, { Router, Request, Response, NextFunction } from 'express'
import db from '../database';
import { validateToken } from '../utils/jwt';
import Joi from 'joi'

const router: Router = Router();

router.use(validateToken)

const schema = Joi.object().keys({
    uslugaId: Joi.number().required(),
    voziloId: Joi.number().required(),
    cena: Joi.number().required(),
    placeno: Joi.boolean().required()
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

// Istorija usluga za odredjeno vozilo
router.get('/istorija/vozilo/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let usluge = await db.PruzenaUsluga.findAll({ where: { voziloId: req.params.id }, include: [
            {model: db.Usluga, as: 'usluga'}, 
            {model: db.Vozilo, as: 'vozilo', include: [{ model: db.Model, as: 'model', include: 'proizvodjac'}, {model: db.Korisnik, as: 'korisnik'}]}
        ] });
        console.log(usluge)
        res.status(200).json(usluge)
    } catch (e) {
        console.log(e)
    }
})

// Istorija usluga za sva vozila odredjenog korisnika
router.get('/istorija/korisnik/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let korisnik = await db.Korisnik.findOne({where: { id: req.params.id }, include: 'vozila'})
        let vozila = korisnik.vozila.map((vozilo: any) => vozilo.id)
        let usluge = await db.PruzenaUsluga.findAll({ where: { voziloId: vozila }, include: [
            {model: db.Usluga, as: 'usluga'}, 
            {model: db.Vozilo, as: 'vozilo', include: [{ model: db.Model, as: 'model', include: 'proizvodjac'}, {model: db.Korisnik, as: 'korisnik'}]}
        ] });
        res.status(200).json(usluge)
    } catch (e) {
        console.log(e)
    }
})

router.put('/placanje/:id', async (req: Request, res: Response, next: NextFunction) => {
    let usluga = await db.PruzenaUsluga.findOne({ where: { id: req.params.id } })
    usluga.placeno = true
    usluga.save()
    res.status(200).json(usluga)
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.validate(req.body);
    if (validation.error) {
        res.status(400).send({message: validation.error.message})
        return
    }
    let usluga = await db.PruzenaUsluga.create({
        uslugaId: req.body.uslugaId,
        voziloId: req.body.voziloId,
        cena: req.body.cena,
        placeno: req.body.placeno
    });
    res.json(usluga);
})

export default router
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../database"));
const jwt_1 = require("../utils/jwt");
const joi_1 = __importDefault(require("joi"));
const router = (0, express_1.Router)();
router.use(jwt_1.validateToken);
const schema = joi_1.default.object().keys({
    uslugaId: joi_1.default.number().required(),
    voziloId: joi_1.default.number().required(),
    cena: joi_1.default.number().required(),
    placeno: joi_1.default.boolean().required()
});
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let usluge = yield database_1.default.PruzenaUsluga.findAll({ include: [
                { model: database_1.default.Usluga, as: 'usluga' },
                { model: database_1.default.Vozilo, as: 'vozilo', include: [{ model: database_1.default.Model, as: 'model', include: 'proizvodjac' }, { model: database_1.default.Korisnik, as: 'korisnik' }] }
            ] });
        res.status(200).json(usluge);
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}));
// Istorija usluga za odredjeno vozilo
router.get('/istorija/vozilo/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let usluge = yield database_1.default.PruzenaUsluga.findAll({ where: { voziloId: req.params.id }, include: [
                { model: database_1.default.Usluga, as: 'usluga' },
                { model: database_1.default.Vozilo, as: 'vozilo', include: [{ model: database_1.default.Model, as: 'model', include: 'proizvodjac' }, { model: database_1.default.Korisnik, as: 'korisnik' }] }
            ] });
        console.log(usluge);
        res.status(200).json(usluge);
    }
    catch (e) {
        console.log(e);
    }
}));
// Istorija usluga za sva vozila odredjenog korisnika
router.get('/istorija/korisnik/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let korisnik = yield database_1.default.Korisnik.findOne({ where: { id: req.params.id }, include: 'vozila' });
        let vozila = korisnik.vozila.map((vozilo) => vozilo.id);
        let usluge = yield database_1.default.PruzenaUsluga.findAll({ where: { voziloId: vozila }, include: [
                { model: database_1.default.Usluga, as: 'usluga' },
                { model: database_1.default.Vozilo, as: 'vozilo', include: [{ model: database_1.default.Model, as: 'model', include: 'proizvodjac' }, { model: database_1.default.Korisnik, as: 'korisnik' }] }
            ] });
        res.status(200).json(usluge);
    }
    catch (e) {
        console.log(e);
    }
}));
router.put('/placanje/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let usluga = yield database_1.default.PruzenaUsluga.findOne({ where: { id: req.params.id } });
    usluga.placeno = true;
    usluga.save();
    res.status(200).json(usluga);
}));
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = schema.validate(req.body);
    if (validation.error) {
        res.status(400).send({ message: validation.error.message });
        return;
    }
    let usluga = yield database_1.default.PruzenaUsluga.create({
        uslugaId: req.body.uslugaId,
        voziloId: req.body.voziloId,
        cena: req.body.cena,
        placeno: req.body.placeno
    });
    res.json(usluga);
}));
exports.default = router;

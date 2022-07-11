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
    tip_goriva: joi_1.default.string().valid('BENZIN', 'DIZEL').required(),
    tip_menjaca: joi_1.default.string().valid('6', '5', 'AUTOMATIK').required(),
    broj_registracije: joi_1.default.number().required(),
    broj_sasije: joi_1.default.number().required(),
    broj_motora: joi_1.default.number().required(),
    boja: joi_1.default.string().required(),
    korisnikId: joi_1.default.number().required(),
    modelId: joi_1.default.number().required()
});
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let vozila = yield database_1.default.Vozilo.findAll({ include: ['model', 'korisnik'] });
    res.status(200).json(vozila);
}));
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let vozila = yield database_1.default.Vozilo.findOne({ where: { id: req.params.id }, include: ['model', 'korisnik'] });
    res.status(200).json(vozila);
}));
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = schema.validate(req.body);
    if (validation.error) {
        res.status(400).send(validation.error.message);
        return;
    }
    let vozilo = yield database_1.default.Vozilo.create({
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
}));
router.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = schema.validate(req.body);
    if (validation.error) {
        res.status(400).send(validation.error.message);
        return;
    }
    let vozilo = yield database_1.default.Vozilo.findOne({ where: { id: req.params.id } });
    vozilo.tip_goriva = req.body.tip_goriva;
    vozilo.tip_menjaca = req.body.tip_menjaca;
    vozilo.broj_registracije = req.body.broj_registracije;
    vozilo.broj_sasije = req.body.broj_sasije;
    vozilo.broj_motora = req.body.broj_motora;
    vozilo.boja = req.body.boja;
    vozilo.korisnikId = req.body.korisnikId;
    vozilo.modelId = req.body.modelId;
    vozilo.save();
    res.json(vozilo);
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.default.Vozilo.destroy({ where: { id: req.params.id } });
    res.json('Deleted.');
}));
exports.default = router;

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
    first_name: joi_1.default.string().min(3).required(),
    last_name: joi_1.default.string().min(3).required(),
    phone: joi_1.default.number().required()
});
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let korisnici = yield database_1.default.Korisnik.findAll();
    res.json(korisnici);
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let korisnik = yield database_1.default.Korisnik.findOne({ where: { id: req.params.id } });
    res.json(korisnik);
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = schema.validate(req.body);
    if (validation.error) {
        res.status(400).send(validation.error.message);
        return;
    }
    let korisnik = yield database_1.default.Korisnik.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone
    });
    res.status(200).json(korisnik);
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = schema.validate(req.body);
    if (validation.error) {
        res.send(validation.error.message);
        return;
    }
    let korisnik = yield database_1.default.Korisnik.findOne({ where: { id: req.params.id } });
    korisnik.name = req.body.first_name;
    korisnik.cena = req.body.last_name;
    korisnik.phone = req.body.phone;
    korisnik = yield korisnik.save();
    res.json(korisnik);
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.default.Korisnik.destroy({ where: { id: req.params.id } });
    res.json('Deleted.');
}));
exports.default = router;

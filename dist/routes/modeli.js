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
    name: joi_1.default.string().min(1).required(),
    proizvodjacId: joi_1.default.number().required()
});
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let modeli = yield database_1.default.Model.findAll({ include: 'proizvodjac' });
    res.json(modeli);
}));
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let model = yield database_1.default.Model.findOne({ where: { id: req.params.id } });
    res.json(model);
}));
router.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = schema.validate(req.body);
    if (validation.error) {
        res.status(400).send(validation.error.message);
        return;
    }
    let model = yield database_1.default.Model.findOne({ where: { id: req.params.id } });
    model.name = req.body.name;
    model.proizvodjacId = req.body.proizvodjacId;
    model.save();
    res.status(200).json(model);
}));
router.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.default.Model.destroy({ where: { id: req.params.id } });
    res.json('Deleted');
}));
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = schema.validate(req.body);
    if (validation.error) {
        res.status(400).send(validation.error.message);
        return;
    }
    let model = yield database_1.default.Model.create({
        name: req.body.name,
        proizvodjacId: req.body.proizvodjacId
    });
    res.json(model);
}));
exports.default = router;

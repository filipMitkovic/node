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
const joi_1 = __importDefault(require("joi"));
const database_1 = __importDefault(require("../database"));
const jwt_1 = require("../utils/jwt");
const router = (0, express_1.Router)();
const schema = joi_1.default.object().keys({
    email: joi_1.default.string().email().min(3).required(),
    password: joi_1.default.string().alphanum().min(3).required()
});
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = schema.validate(req.body);
    if (validation.error) {
        res.status(400).send(validation.error.message);
        return;
    }
    const loginReq = req.body;
    try {
        let user = yield database_1.default.User.findOne({ where: { email: loginReq.email } });
        if (user == null) {
            res.status(404).send('User not found');
            return;
        }
        if (user.password != loginReq.password) {
            res.status(401).send('Bad credentials!');
            return;
        }
        const token = (0, jwt_1.generateToken)(user);
        res.send({ id: user.id, jwt: token });
    }
    catch (error) {
        console.log(error);
        return;
    }
}));
exports.default = router;

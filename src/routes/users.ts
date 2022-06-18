import express, { Router, Request, Response, NextFunction } from 'express'
import db from '../database';
import { validateToken } from '../utils/jwt';

const router: Router = Router();

router.use(validateToken)

router.get('/', (req: Request, res: Response) => {
    res.send(req.body.user)
})


export default router
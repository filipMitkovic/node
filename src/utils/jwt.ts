import { sign, verify } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { User } from '../model';

export function generateToken(user: any) {

    const token = sign({user}, 'SECRET_KEY', {expiresIn: '2h'});

    return token
}

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        let jwt = req.headers.authorization;
    
        // verify request has token
        if (!jwt) {
          return res.status(401).json({ message: 'Invalid token ' });
        }

    
        // remove Bearer if using Bearer Authorization mechanism
        if (jwt.toLowerCase().startsWith('bearer')) {
          jwt = jwt.slice('bearer'.length).trim();
        }
    
        // verify token
        const decodedToken = verify(jwt, 'SECRET_KEY');
        req.user = decodedToken as User
    
        next();

      } catch (error: any) {
        
        if (error.name === 'TokenExpiredError') {
          res.status(401).json({ message: 'Expired token' });
          return;
        }
    
        res.status(500).json({ message: 'Failed to authenticate user' });
      }
}
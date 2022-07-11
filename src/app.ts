import express, { Application, Request, Response } from 'express';
import cors from 'cors'
import login from './routes/login';
import users from './routes/users';
import proizvodjaci from './routes/proizvodjaci'
import modeli from './routes/modeli'
import pruzeneUsluge from './routes/pruzene-usluge'
import usluge from './routes/usluge'
import korisnici from './routes/korisnici'
import vozila from './routes/vozila'
import db from './database';
const port = 8000;

const app: Application = express();

app.use(express.json())
app.use(cors())

app.use('/login', login);
app.use('/users', users);
app.use('/proizvodjaci', proizvodjaci)
app.use('/modeli', modeli)
app.use('/pruzene-usluge', pruzeneUsluge)
app.use('/usluge', usluge)
app.use('/korisnici', korisnici)
app.use('/vozila', vozila)


app.get('/', (req: Request, res: Response) => {
    res.send('Hello');
})

db.connect()

app.listen(port, () => console.log(`Server running on port ${port}`));
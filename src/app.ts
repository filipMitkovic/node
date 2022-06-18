import express, { Application, Request, Response } from 'express';
import login from './routes/login';
import users from './routes/users';
import proizvodjaci from './routes/proizvodjaci'
import db from './database';
const port = 3000;

const app: Application = express();

app.use(express.json())

app.use('/login', login);
app.use('/users', users);
app.use('/proizvodjaci', proizvodjaci)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello');
})

db.connect()

app.listen(port, () => console.log(`Server running on port ${port}`));
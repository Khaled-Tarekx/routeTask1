import 'dotenv/config';
import express from 'express';
import UserRouter from './src/modules/users/routers.js';
import JobRouter from './src/modules/jobs/routers.js';
import CompanayRouter from './src/modules/companies/routers.js';
import ApplicationRouter from './src/modules/applications/routers.js';
import AuthRouter from './src/modules/auth/routers.js';
import {isAuthenticated} from './src/modules/auth/middlewares.js';
import {connection} from './database/connection.js';

const app = express();
const port = process.env.PORT;
connection
	.then(() => console.log('connented to db successfully'))
	.catch(() => console.log('connection to db didnt work'));

app.get('/', (req, res) => res.send('Hello World!'));

app.use(express.json());
app.use('/auth', AuthRouter);

app.use(isAuthenticated);

app.use('/api/users', UserRouter);
app.use('/api/companies', CompanayRouter);
app.use('/api/jobs', JobRouter);
app.use('/api/applications', ApplicationRouter);

app.use('*', (req, res) => res.json('Page Not Found'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

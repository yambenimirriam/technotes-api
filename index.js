import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './src/db/connect.js';
import auth from './src/routes/auth.routes.js';
import notes from './src/routes/note.routes.js';
import users from './src/routes/user.routes.js';

/*****=== CONFIGURATION *****/
dotenv.config();
const URL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 5000;
const app = express();

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('common'));

app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/notes', notes);

const startServer = async () => {
  try {
    connectDB(URL);
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();

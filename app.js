import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';

import {Schema} from "./data/schema";
import graphQLHTTP from "express-graphql";

const APP_PORT = process.env.PORT || 3000;

var app = express();

app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());


app.use('/', graphQLHTTP({
  graphiql: true,
  pretty: true,
  schema: Schema,
}));


app.listen(APP_PORT, () => {
  console.log(`App is now running on port: ${APP_PORT}`);
});

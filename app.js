import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import {Schema} from "./data/schema";
import graphQLHTTP from "express-graphql";
// webpack dev server for relay
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;

// Expose a GraphQL endpoint
var graphQLServer = express();
graphQLServer.use('/', graphQLHTTP({
  graphiql: true,
  pretty: true,
  schema: Schema,
}));
graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));

// Serve the Relay app
var compiler = webpack({
  entry: path.resolve(__dirname, 'js', 'main.js'),
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        query: {stage: 0, plugins: ['./build/babelRelayPlugin']},
        test: /\.js$/,
      }
    ]
  },
  output: {filename: 'main.js', path: '/'}
});
var app = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
  publicPath: '/js/',
  stats: {colors: true}
});

// regular express app setup stuff:

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static resources
app.use('/', express.static(path.resolve(__dirname, 'public')));


import routes from './routes/index';
app.use('/', routes);

// catch 404 and forward to error handler
// app.use((req, res, next) => {
//   let err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use((err, req, res, next) => {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// production error handler
// no stacktraces leaked to user
// app.use((err, req, res, next) => {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});





// let PORT = process.env.PORT || 3000;

// let app = express();

// app.use(express.static(path.join(__dirname, 'public')));


// app.use("/graphql", GraphQLHTTP({
//   schema,
//   graphiql: true
// }));



// app.listen(PORT, () => {
//   console.log(`I'm listening on this port: ${PORT}`);
// })

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import http from 'http';
import {Server} from 'socket.io';
import dotenv from "dotenv";
dotenv.config();


import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';


import initRepo from './controllers/terminalCommands/init.js';
import addRepo from './controllers/terminalCommands/add.js';
import commitRepo from './controllers/terminalCommands/commit.js';
import pushRepo from './controllers/terminalCommands/push.js';
import pullRepo from './controllers/terminalCommands/pull.js';
import revertRepo from './controllers/terminalCommands/revert.js';

import mainRouter from './routes/main.routes.js';

const startServer = () => {
    const app = express();
    const port = process.env.PORT || 5000;
    const mongoURI = process.env.MONGODB_URI;

    app.use(cors({origin: '*'}));
    app.use(bodyParser.json({limit: '10mb'}));
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
    app.use(express.json());

    app.use('/', mainRouter);


    mongoose.connect(mongoURI)
        .then(() => {console.log("MongoDB connected");})
        .catch((err) => {console.log("Unable to connect: ", err);})

    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }}
    );

    io.on("connection", (socket) => {
        socket.on("joinRoom", (userID) => {
            user = userID;
            console.log("====================");
            console.log(`User connected: ${user}`);
            console.log("====================");
            socket.join(userID);
        })
    })

    const db = mongoose.connection;
    db.once('open', async() => {
        console.log("CRUD operations called!");
    });

    httpServer.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    })
}

yargs(hideBin(process.argv))
    .command(
        "start",
        "Starts a new backend server",
        {},
        startServer
    )
    .command(
        "init",
        "Initialize a new repository",
        {},
        initRepo
    )
    .command(
        "add <file>",
        "Add a file to staged",
        (yargs) => {
            yargs.positional('file', {
                describe: 'File to add',
                type: 'string'
            });
        },
        (argv) => {
            addRepo(argv.file);
        }
    )
    .command(
        "commit <msg>",
        "Commit the staged files",
        (yargs) => {
            yargs.positional('msg', {
                describe: 'commit message',
                type: 'string'
            });
        },
        (argv) => {
            commitRepo(argv.msg);
        }
    )
    .command(
        "push",
        "Push the committed changes",
        {},
        pushRepo
    )
    .command(
        "pull",
        "Pull the latest changes",
        {},
        pullRepo
    )
    .command(
        "revert <commitID>",
        "Revert to a specific commit",
        (yargs) => {
            yargs.positional('commitID', {
                describe: 'Commit ID to revert to',
                type: 'string'
            });
        },
        (argv) => {
            revertRepo(argv.commitID);
        }
    )
    .demandCommand(1, 'You need at least one command!')
    .help().argv;
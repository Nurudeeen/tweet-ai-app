import { createLogger, format, transports, addColors } from 'winston';
import { Sequelize, DataType } from 'sequelize-typescript';
import * as WinstonSequelize from 'winston-transport-sequelize';

import * as dotenv from "dotenv"
dotenv.config()

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
    dialect: 'postgres',
    logging: false,
    ssl: true,
    dialectOptions:{
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
})

sequelize.sync()

const options = {
    level: 'error', // default 'info
    sequelize: sequelize, // sequelize instance [required]
    tableName: 'serverLog', // default name
    meta: { server: 'ceeride' }, // meta data [optional]
    fields: { meta: DataType.JSON }, // merge model fields
    modelOptions: { timestamps: true }, // merge model options
    format: format.combine(
        format.timestamp({
            format: 'DD/MM/YYYY, HH:mm:ss'
        }),
        format.metadata(),
        format.align(),
        format.json()
    )
  }

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

addColors(colors)

const logger = createLogger({
    transports: [
        new WinstonSequelize(options),
        new transports.Console({
            level: 'debug',
            format: format.combine(
                format.colorize({all: true, colors: colors, level: true, message: true}),
                format.timestamp({
                    format: 'DD/MM/YYYY, HH:mm:ss'
                }),
                format.metadata(),
                format.align(),
                format.prettyPrint({
                    colorize: true,
                    depth: 10

                }),
                format.printf(info => `[Nest] ${info.level}  - ${info.metadata.timestamp}  ${info.message}${ info.metadata.message ? ' - ' + info.metadata.message : ''}${ info.metadata.label ? ' - ' + info.metadata.label : ''}`),
              ),
            handleExceptions: true,
        })
    ],
    exitOnError: false
});

export{ logger };

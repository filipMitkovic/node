"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
let db = {};
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    db.sequelize = new sequelize_1.Sequelize('node', 'root', '', {
        host: 'localhost',
        dialect: 'mysql'
    });
    initData(db.sequelize);
});
const initData = (sequelize) => __awaiter(void 0, void 0, void 0, function* () {
    db.User = db.sequelize.define('User', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        full_name: {
            type: sequelize_1.DataTypes.STRING
        },
        email: {
            type: sequelize_1.DataTypes.STRING
        },
        password: {
            type: sequelize_1.DataTypes.STRING
        }
    }, { timestamps: false });
    db.Korisnik = db.sequelize.define('Korisnik', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        first_name: {
            type: sequelize_1.DataTypes.STRING,
        },
        last_name: {
            type: sequelize_1.DataTypes.STRING,
        },
        phone: {
            type: sequelize_1.DataTypes.STRING,
        }
    }, { tableName: 'korisnici', timestamps: false });
    db.Proizvodjac = db.sequelize.define('Proizvodjac', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
        }
    }, { tableName: 'proizvodjaci', timestamps: false });
    db.Model = db.sequelize.define('Model', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
        }
    }, { tableName: 'modeli', timestamps: false });
    db.Usluga = db.sequelize.define('Usluga', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
        },
        cena: {
            type: sequelize_1.DataTypes.DOUBLE
        }
    }, { tableName: 'usluge', timestamps: false });
    db.Vozilo = db.sequelize.define('Vozilo', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        tip_goriva: {
            type: sequelize_1.DataTypes.ENUM('BENZIN', 'DIZEL')
        },
        tip_menjaca: {
            type: sequelize_1.DataTypes.ENUM('5', '6', 'AUTOMATIK')
        },
        broj_registracije: {
            type: sequelize_1.DataTypes.INTEGER
        },
        broj_sasije: {
            type: sequelize_1.DataTypes.INTEGER
        },
        broj_motora: {
            type: sequelize_1.DataTypes.INTEGER
        },
        boja: {
            type: sequelize_1.DataTypes.STRING
        }
    }, { tableName: 'vozila', timestamps: false });
    db.PruzenaUsluga = db.sequelize.define('PruzenaUsluga', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        cena: {
            type: sequelize_1.DataTypes.DOUBLE
        },
        placeno: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, { tableName: 'pruzene_usluge', timestamps: false });
    // Associations
    db.Model.belongsTo(db.Proizvodjac, { as: 'proizvodjac', foreignKey: 'proizvodjacId', onDelete: 'cascade', hooks: true });
    db.Proizvodjac.hasMany(db.Model, { as: 'modeli', foreignKey: 'proizvodjacId' });
    db.Vozilo.belongsTo(db.Model, { as: 'model', foreignKey: 'modelId', onDelete: 'cascade', hooks: true });
    db.Model.hasMany(db.Vozilo, { as: 'vozila', foreignKey: 'modelId' });
    db.Vozilo.belongsTo(db.Korisnik, { as: 'korisnik', foreignKey: 'korisnikId', onDelete: 'cascade', hooks: true });
    db.Korisnik.hasMany(db.Vozilo, { as: 'vozila', foreignKey: 'korisnikId' });
    db.PruzenaUsluga.belongsTo(db.Usluga, { as: 'usluga', foreignKey: 'uslugaId', onDelete: 'cascade', hooks: true });
    db.Usluga.hasMany(db.PruzenaUsluga, { as: 'pruzeneUsluge', foreignKey: 'uslugaId' });
    db.PruzenaUsluga.belongsTo(db.Vozilo, { as: 'vozilo', foreignKey: 'voziloId', onDelete: 'cascade', hooks: true });
    db.Vozilo.hasMany(db.PruzenaUsluga, { as: 'pruzeneUsluge', foreignKey: 'voziloId' });
    try {
        yield sequelize.sync();
    }
    catch (e) {
        console.error(e);
    }
});
db.Sequelize = sequelize_1.Sequelize;
db.connect = connect;
exports.default = db;

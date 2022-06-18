import { Sequelize, DataTypes } from 'sequelize'

let db: any = {}

const connect = async () => {
    db.sequelize = new Sequelize('node', 'root', '', {
        host: 'localhost',
        dialect: 'mysql'
    })
    
    initData(db.sequelize)
}


const initData = async (sequelize: Sequelize) => {
    db.User = db.sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        full_name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        }
    }, { timestamps: false })

    db.Korisnik = db.sequelize.define('Korisnik', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        first_name: {
            type: DataTypes.STRING,
        },
        last_name: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
        }
    }, { tableName: 'korisnici', timestamps: false })

    db.Proizvodjac = db.sequelize.define('Proizvodjac', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
        }
    }, { tableName: 'proizvodjaci', timestamps: false })

    db.Model = db.sequelize.define('Model', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
        }
    }, { tableName: 'modeli', timestamps: false })

    db.Usluga = db.sequelize.define('Usluga', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
        },
        cena: {
            type: DataTypes.DOUBLE
        }
    }, { tableName: 'usluge', timestamps: false })

    db.Vozilo = db.sequelize.define('Vozilo', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        tip_goriva: {
            type: DataTypes.ENUM('BENZIN', 'DIZEL')
        },
        tip_menjaca: {
            type: DataTypes.ENUM('5', '6', 'AUTOMATIK')
        },
        broj_registracije: {
            type: DataTypes.INTEGER
        },
        broj_sasije: {
            type: DataTypes.INTEGER
        },
        broj_motora: {
            type: DataTypes.INTEGER
        },
        boja: {
            type: DataTypes.STRING
        }
    }, { tableName: 'vozila', timestamps: false })

    db.PruzenaUsluga = db.sequelize.define('PruzenaUsluga', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        cena: {
            type: DataTypes.DOUBLE
        }
    }, { tableName: 'pruzene_usluge', timestamps: false })



    // Associations
    db.Model.belongsTo(db.Proizvodjac);
    db.Proizvodjac.hasMany(db.Model, {as: 'modeli'});

    db.Vozilo.belongsTo(db.Model)
    db.Model.hasMany(db.Vozilo, {as: 'vozila'})

    db.Vozilo.belongsTo(db.Korisnik)
    db.Korisnik.hasMany(db.Vozilo, {as: 'vozila'})
    
    db.PruzenaUsluga.belongsTo(db.Usluga)
    db.Usluga.hasMany(db.PruzenaUsluga, {as: 'pruzene_usluge'})
    db.PruzenaUsluga.belongsTo(db.Korisnik)
    db.Korisnik.hasMany(db.PruzenaUsluga, {as: 'pruzene_usluge'})
    db.PruzenaUsluga.belongsTo(db.Vozilo)
    db.Vozilo.hasMany(db.PruzenaUsluga, {as: 'pruzene_usluge'})



    await db.User.sync();
    await db.Korisnik.sync();
    await db.Proizvodjac.sync();
    await db.Model.sync();
    await db.Usluga.sync();
    await db.Vozilo.sync();
    await db.PruzenaUsluga.sync();
}

db.Sequelize = Sequelize;
db.connect = connect

export default db
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
        },
        placeno: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, { tableName: 'pruzene_usluge', timestamps: false })
    


    // Associations
    db.Model.belongsTo(db.Proizvodjac, {as: 'proizvodjac', foreignKey: 'proizvodjacId', onDelete: 'cascade', hooks: true});
    db.Proizvodjac.hasMany(db.Model, {as: 'modeli', foreignKey: 'proizvodjacId'});

    db.Vozilo.belongsTo(db.Model, {as: 'model', foreignKey: 'modelId', onDelete: 'cascade', hooks: true})
    db.Model.hasMany(db.Vozilo, {as: 'vozila', foreignKey: 'modelId'})

    db.Vozilo.belongsTo(db.Korisnik, {as: 'korisnik', foreignKey: 'korisnikId', onDelete: 'cascade', hooks: true})
    db.Korisnik.hasMany(db.Vozilo, {as: 'vozila', foreignKey: 'korisnikId'})
    
    db.PruzenaUsluga.belongsTo(db.Usluga, { as: 'usluga', foreignKey: 'uslugaId', onDelete: 'cascade', hooks: true })
    db.Usluga.hasMany(db.PruzenaUsluga, { as: 'pruzeneUsluge', foreignKey: 'uslugaId'})

    db.PruzenaUsluga.belongsTo(db.Vozilo, { as: 'vozilo', foreignKey: 'voziloId' })
    db.Vozilo.hasMany(db.PruzenaUsluga, { as: 'pruzeneUsluge', foreignKey: 'voziloId', onDelete: 'cascade', hooks: true })



    try {
        await sequelize.sync()
    } catch (e) {
        console.error(e)
    }
}

db.Sequelize = Sequelize;
db.connect = connect

export default db
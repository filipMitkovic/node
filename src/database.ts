import { Sequelize, DataTypes } from 'sequelize'

let db: any = {}

const connect = async () => {
    db.sequelize = new Sequelize('node', 'root', '', {
        host: 'localhost',
        dialect: 'mysql'
    })
    initData(db.sequelize)
    try {
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
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



    // Associations
    db.Proizvodjac.hasMany(db.Model);
    db.Model.belongsTo(db.Proizvodjac);

    await db.User.sync();
    await db.Korisnik.sync();
    await db.Proizvodjac.sync();
    await db.Model.sync();
    await db.Usluga.sync();
}

db.Sequelize = Sequelize;
db.connect = connect

export default db
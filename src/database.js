import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DBNAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    typeCast: function (field, next) {
        if (field.type === 'TINY' && field.length === 1) {
            return (field.string() === '1');
        } else {
            return next();
        }
    }
});

export const migration = async () => {
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS activities(
            id INT NOT NULL AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            PRIMARY KEY (id)
        )
        `);
        await pool.query(`
        CREATE TABLE IF NOT EXISTS todos (
            id INT NOT NULL auto_increment,
            activity_group_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            priority VARCHAR(255) NOT NULL,
            is_active BOOLEAN NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            PRIMARY KEY (id),
            INDEX activity_group_id (activity_group_id),
            CONSTRAINT todos_fk_1 FOREIGN KEY (activity_group_id) REFERENCES activities (id) ON DELETE CASCADE ON UPDATE CASCADE
        )
        `);
        console.log('Running Migration Successfully!');
    } catch (err) {
        throw err;
    }
};


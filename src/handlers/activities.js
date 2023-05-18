import { pool } from "../database.js"

export const getAllActivities = async (req, rep) => {

    const { email } = req.params;

    if (email !== undefined && email !== null && email.length !== '') {
        const [rows] = await pool.query('SELECT * FROM activities WHERE email = ?', [email]);

        await rep.send({ status: "Success", message: "Success", data: rows });
    }

    const [rows] = await pool.query('SELECT * FROM activities', []);

    await rep.send({ status: "Success", message: "Success", data: rows });
}

export const getOneActivityById = async (req, rep) => {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM activities WHERE id = ?', [id])
    if (rows.length == 0) {
        return await rep.code(404).send({ status: "Not Found", message: `Activity with ID ${id} Not Found` });
    }

    await rep.send({ status: "Success", message: "Success", data: rows[0] });
}

export const createActivity = async (req, rep) => {

    const { title, email } = req.body;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (title == undefined || title == null || title.length == 0) {
        return await rep.code(400).send({ status: "Bad Request", message: "title cannot be null" });
    }

    if (email == undefined || email == null || email.length == 0) {
        return await rep.code(400).send({ status: "Bad Request", message: "email cannot be null" });
    }

    const [rows] = await pool.query('INSERT INTO activities(title, email, created_at, updated_at) VALUES(?,?,?,?)', [title, email, now, now]);

    await rep.code(201).send({ status: "Success", message: "Success", data: { title, email, id: rows.insertId } });

}

export const editActivity = async (req, rep) => {

    const { title } = req.body;
    const { id } = req.params;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let [rows] = await pool.query('SELECT * FROM activities WHERE id = ?', [id])

    if (rows.length == 0) {
        return await rep.code(404).send({ status: "Not Found", message: `Activity with ID ${id} Not Found` });
    }

    await pool.query("UPDATE activities SET title = ?, updated_at = ? WHERE id = ?", [title, now, id]);
    [rows] = await pool.query('SELECT * FROM activities WHERE id = ?', [id])

    await rep.send({ status: "Success", message: "Success", data: rows[0] })

}

export const deleteActivity = async (req, rep) => {

    const { id } = req.params;

    const [rows] = await pool.query('SELECT * FROM activities WHERE id = ?', [id])

    if (rows.length == 0) {
        return await rep.code(404).send({ status: "Not Found", message: `Activity with ID ${id} Not Found` });
    }

    await pool.query('DELETE FROM activities WHERE id = ?', [id]);

    await rep.send({ status: "Success", message: "Success", data: {} })

}

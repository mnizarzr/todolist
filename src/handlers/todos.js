import { log } from "console";
import { pool } from "../database.js"

export const getAllTodos = async (req, rep) => {

    const { activity_group_id } = req.query;

    if (activity_group_id !== undefined && activity_group_id !== null) {
        const [rows] = await pool.query('SELECT * FROM todos WHERE activity_group_id = ?', [activity_group_id]);
        return await rep.send({ status: "Success", message: "Success", data: rows });
    }

    const [rows] = await pool.query('SELECT * FROM todos', []);

    await rep.send({ status: "Success", message: "Success", data: rows });
}

export const getOneTodoById = async (req, rep) => {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [id])
    if (rows.length == 0) {
        return await rep.code(404).send({ status: "Not Found", message: `Todo with ID ${id} Not Found` });
    }

    await rep.send({ status: "Success", message: "Success", data: rows[0] });
}

export const createTodo = async (req, rep) => {

    const { activity_group_id, title } = req.body;
    const priority = req.body.priority || "very-high";
    const is_active = (req.body.is_active !== undefined && req.body.is_active !== null) ? req.body.is_active : true;

    if (title == undefined || title == null || title.length == 0) {
        return await rep.code(400).send({ status: "Bad Request", message: "title cannot be null" });
    }

    if (activity_group_id == undefined || activity_group_id == null || activity_group_id.length == 0) {
        return await rep.code(400).send({ status: "Bad Request", message: "activity_group_id cannot be null" });
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const newTodo = await pool.query('INSERT INTO todos(activity_group_id, title, priority, is_active, created_at, updated_at) VALUES(?,?,?,?,?,?)',
        [activity_group_id, title, priority, is_active, now, now]);

    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [newTodo[0].insertId])

    await rep.code(201).send({ status: "Success", message: "Success", data: rows[0] });

}

export const editTodo = async (req, rep) => {

    const { title, priority, is_active, status } = req.body;
    const { id } = req.params;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [id])

    if (rows.length == 0) {
        return await rep.code(404).send({ status: "Not Found", message: `Todo with ID ${id} Not Found` });
    }

    let updatedColumns = [];
    let columnsValue = [];

    if (title !== undefined && title !== null && title.length !== 0) {
        updatedColumns.push("title = ?")
        columnsValue.push(title);
    }

    if (priority !== undefined && priority !== null && priority.length !== 0) {
        updatedColumns.push("priority = ?");
        columnsValue.push(priority);
    }

    if (is_active !== undefined && is_active !== null) {
        updatedColumns.push("is_active = ?");
        columnsValue.push(is_active);
    }

    await pool.query(`UPDATE todos SET ${updatedColumns.join(',')}, updated_at = ? WHERE id = ?`, [...columnsValue, now, id]);
    [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [id])

    await rep.send({ status: "Success", message: "Success", data: rows[0] })

}

export const deleteTodo = async (req, rep) => {

    const { id } = req.params;

    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [id])

    if (rows.length == 0) {
        return await rep.code(404).send({ status: "Not Found", message: `Todo with ID ${id} Not Found` });
    }

    await pool.query('DELETE FROM todos WHERE id = ?', [id]);

    await rep.send({ status: "Success", message: "Success", data: {} })

}

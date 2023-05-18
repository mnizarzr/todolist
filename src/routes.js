import { createActivity, deleteActivity, editActivity, getAllActivities, getOneActivityById } from "./handlers/activities.js";
import { createTodo, deleteTodo, editTodo, getAllTodos, getOneTodoById } from "./handlers/todos.js";

export const activitiesRoutes = async (app, _, done) => {
    app.get('/activity-groups', getAllActivities);
    app.get('/activity-groups/:id', getOneActivityById);
    app.post('/activity-groups', createActivity);
    app.patch('/activity-groups/:id', editActivity);
    app.delete('/activity-groups/:id', deleteActivity);
    done();
}

export const todosRoutes = async (app, _, done) => {
    app.get('/todo-items', getAllTodos);
    app.get('/todo-items/:id', getOneTodoById);
    app.post('/todo-items', createTodo);
    app.patch('/todo-items/:id', editTodo);
    app.delete('/todo-items/:id', deleteTodo);
    done();
}


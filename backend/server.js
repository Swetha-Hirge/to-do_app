const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const FILE_PATH = './todos.json';

function readTodoFile() {
    try {
        if (!fs.existsSync(FILE_PATH)) {
            fs.writeFileSync(FILE_PATH, JSON.stringify([]));
        }

        const data = fs.readFileSync(FILE_PATH, 'utf-8').trim();

        if (data === '') {
            return [];
        }

        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading todos file:', error);
        return [];
    }
}

function writeTodosFile(todos) {
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2));
    } catch (error) {
        console.error('Error writing todos file:', error);
    }
}

function getNextId(todos) {
    if (todos.length === 0) return 1;
    const maxId = Math.max(...todos.map(todo => todo.id));
    return maxId + 1;
}

app.get('/todos', (req, res) => {
    try {
        const todos = readTodoFile();
        return res.json(todos);
    } catch (error) {
        console.error('Error in GET /todos:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/todos', (req, res) => {
    try {
        const todos = readTodoFile();
        const newId = getNextId(todos);

        const todo = {
            id: newId,
            todo: req.body.todo,
            status: req.body.status || 'pending'
        };

        todos.push(todo);
        writeTodosFile(todos);

        return res.json(todo);
    } catch (error) {
        console.error('Error in POST /todos:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/todos/:id', (req, res) => {
    try {
        let todos = readTodoFile();
        todos = todos.filter(todo => todo.id !== parseInt(req.params.id));
        writeTodosFile(todos);
        return res.send('Deleted');
    } catch (error) {
        console.error('Error in DELETE /todos/:id:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/todos/:id', (req, res) => {
    try {
        let todos = readTodoFile();
        const todoIndex = todos.findIndex(todo => todo.id === parseInt(req.params.id));

        if (todoIndex === -1) {
            return res.status(404).json({ error: 'Not found' });
        }

        if (req.body.todo !== undefined) {
            todos[todoIndex].todo = req.body.todo;
        }

        if (req.body.status !== undefined) {
            todos[todoIndex].status = req.body.status;
        }

        writeTodosFile(todos);
        return res.json(todos[todoIndex]);
    } catch (error) {
        console.error('Error in PUT /todos/:id:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

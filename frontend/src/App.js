import React, { useState, useEffect } from 'react';

function App() {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const res = await fetch('http://localhost:5000/todos');
            const data = await res.json();
            setTodos(data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const addTodo = async () => {
        if (input.trim() === '') return;

        try {
            await fetch('http://localhost:5000/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ todo: input, status: 'pending' }),
            });

            setInput('');
            fetchTodos();
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await fetch(`http://localhost:5000/todos/${id}`, {
                method: 'DELETE',
            });

            fetchTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'pending' ? 'complete' : 'pending';

        try {
            await fetch(`http://localhost:5000/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            fetchTodos();
        } catch (error) {
            console.error('Error updating todo status:', error);
        }
    };

    // Counters
    const totalTasks = todos.length;
    const completedTasks = todos.filter(todo => todo.status === 'complete').length;
    const pendingTasks = todos.filter(todo => todo.status === 'pending').length;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>To-Do App</h1>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Add a task"
                style={{ padding: '8px', marginRight: '8px' }}
            />
            <button onClick={addTodo} style={{ padding: '8px' }}>
                Add
            </button>

            <h3 style={{ marginTop: '20px' }}>
                Total: {totalTasks} | Completed: {completedTasks} | Pending: {pendingTasks}
            </h3>

            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        style={{
                            marginBottom: '10px',
                            padding: '10px',
                            backgroundColor: todo.status === 'complete' ? '#d4edda' : '#f8d7da',
                            borderRadius: '5px',
                        }}
                    >
                        <strong>{todo.todo}</strong> ({todo.status}){' '}
                        <button
                            onClick={() => toggleStatus(todo.id, todo.status)}
                            style={{ marginLeft: '10px', padding: '4px 8px' }}
                        >
                            Toggle Status
                        </button>
                        <button
                            onClick={() => deleteTodo(todo.id)}
                            style={{ marginLeft: '10px', padding: '4px 8px', color: 'white', backgroundColor: 'red', border: 'none' }}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;

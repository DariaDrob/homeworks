import TodoList from './components/TodoList';
import ClassTodoList from './components/ClassTodoList';
import './App.css';

function App() {
    return (
        <div className="App">
            <h1>Мій To-Do List</h1>
            <div style={{ marginBottom: '40px' }}>
                <TodoList />
            </div>
            <div>
                <ClassTodoList />
            </div>
        </div>
    );
}

export default App;
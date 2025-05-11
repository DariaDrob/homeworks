import React from 'react';
import TodoItem from './TodoItem';
import Input from './Input';
import Button from './Button';

class ClassTodoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: [],
            newTodo: '',
            isListVisible: true,
        };
    }

    componentDidMount() {
        console.log('ClassTodoList змонтовано');
    }

    componentDidUpdate() {
        console.log('ClassTodoList оновлено');
    }

    addTodo = () => {
        if (this.state.newTodo.trim() !== '') {
            this.setState((prevState) => ({
                todos: [...prevState.todos, prevState.newTodo],
                newTodo: '',
            }));
        }
    };

    deleteTodo = (index) => {
        this.setState((prevState) => ({
            todos: prevState.todos.filter((_, i) => i !== index),
        }));
    };

    toggleListVisibility = () => {
        this.setState((prevState) => ({
            isListVisible: !prevState.isListVisible,
        }));
    };

    handleInputChange = (event) => {
        this.setState({ newTodo: event.target.value });
    };

    render() {
        return (
            <div>
                <h2>Список Завдань (Класовий)</h2>
                <Input
                    placeholder="Введіть нове завдання..."
                    onChange={this.handleInputChange}
                    value={this.state.newTodo}
                />
                <Button text="Додати" onClick={this.addTodo} />
                <Button
                    text={this.state.isListVisible ? 'Приховати список' : 'Показати список'}
                    onClick={this.toggleListVisibility}
                />
                {this.state.isListVisible && (
                    <ul>
                        {this.state.todos.map((todo, index) => (
                            <TodoItem key={index} todo={todo} onDelete={() => this.deleteTodo(index)} />
                        ))}
                    </ul>
                )}
            </div>
        );
    }
}

export default ClassTodoList;
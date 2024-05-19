import { useState, useEffect } from 'react';

export function App() {
  const [state, setState] = useState(() => {
    const savedState = localStorage.getItem('todos');
    return savedState ? JSON.parse(savedState) : [];
  });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(state));
  }, [state]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch(
  //       'https://jsonplaceholder.typicode.com/todos'
  //     );
  //     const data = await response.json();
  //     setState(data);
  //   };
  //   fetchData();
  // }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSaveTask = () => {
    if (inputValue.trim() !== '') {
      setState((prev) => [...prev, { title: inputValue, completed: false }]);
      setInputValue('');
    }
  };

  const handleRemoveTask = (taskIndexToRemove) => {
    setState((prev) => prev.filter((_, index) => index !== taskIndexToRemove));
  };

  const updateTaskStatus = (index) => {
    setState((prev) =>
      prev.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (index, newName) => {
    setState((prev) =>
      prev.map((task, i) => (i === index ? { ...task, title: newName } : task))
    );
  };

  return (
    <>
      <div className='container'>
        <h1>My Todos</h1>
        <div className='todo-container'>
          <input
            placeholder='Add something to do ...'
            type='text'
            value={inputValue}
            onChange={handleInputChange}
          />
          <button onClick={handleSaveTask}>Save</button>
        </div>
        <div>
          <ul className='todo-list'>
            {state.map((task, index) => (
              <li className='todo-list-item' key={task.id}>
                <input
                  className='input-checkbox'
                  type='checkbox'
                  checked={task.completed}
                  onChange={() => updateTaskStatus(index)}
                />
                <input
                  className={`input-value ${
                    task.completed ? 'line-through' : ''
                  }`}
                  type='text'
                  value={task.title}
                  onChange={(e) => editTask(index, e.target.value)}
                />
                <button onClick={() => handleRemoveTask(index)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

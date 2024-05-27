import { useEffect, useState } from 'react';

export function App() {
  const [state, setState] = useState(
    JSON.parse(localStorage.getItem('todos')) || []
  );
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/todos'
      );
      const data = await response.json();
      setState(data);
    };
    fetchData();
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSaveTask = () => {
    if (inputValue.trim() !== '') {
      fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify({
          title: inputValue,
          completed: false,
          id: state.length + 1,
        }),
      })
        .then(() => {
          setState((prev) => [
            ...prev,
            { title: inputValue, completed: false, id: state.length + 1 },
          ]);
          setInputValue('');
        })
        .catch((e) => {
          alert(e.message);
        });
    }
  };

  const handleRemoveTask = (taskIndexToRemove) => {
    fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'DELETE',
    }).then((e) => {
      if (e.status >= 400) {
        alert("Can't delete, try later");
      } else {
        setState((prev) =>
          prev.filter((_, index) => index !== taskIndexToRemove)
        );
      }
    });
  };

  const updateTaskStatus = (index) => {
    fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'PATCH',
      body: JSON.stringify({
        completed: !task.completed,
      }),
    })
      .then(() => {
        setState((prev) =>
          prev.map((task, i) =>
            i === index ? { ...task, completed: !task.completed } : task
          )
        );
      })
      .catch((e) => {
        alert(e.message);
      });
  };

  const onChange = () => {
    setState((prev) =>
      prev.map((task, i) => (i === index ? { ...task, title: newName } : task))
    );
  };

  const editTask = (index, newName) => {
    fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      body: JSON.stringify({
        title: newName,
      }),
    })
      .then(() => {
        setState((prev) =>
          prev.map((task, i) =>
            i === index ? { ...task, title: newName } : task
          )
        );
      })
      .catch((e) => {
        alert(e.message);
      });
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
                  onChange={(e) => onChange(index, e.target.value)}
                  onBlur={(e) => editTask(index, e.target.value)}
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

import { useState, useCallback } from "react";
import TodoList from "@/assets/todo.json";
import { FRUIT, VEGETABLE } from "@/constants/todo";
import { ITodo } from "@/types/todo.types";

export default function Home() {
  const [todoList, setTodoList] = useState<ITodo[]>(TodoList);
  const [fruitList, setFruitList] = useState<ITodo[]>([]);
  const [vegetableList, setVegetableList] = useState<ITodo[]>([]);
  const [, setRemoveQueueList] = useState<ITodo[]>([]);

  const filterTodoByName = (todoList: ITodo[], todo: ITodo) =>
    todoList.filter((_todo) => _todo.name !== todo.name);

  const autoRemoveTodo = useCallback((todo: ITodo) => {
    setRemoveQueueList((prev) => [...prev, todo]);
    setTimeout(() => {
      setRemoveQueueList((prev) => {
        if (
          prev.map((removeQueue) => removeQueue.name).indexOf(todo.name) > -1
        ) {
          removeTodo(todo);
        }
        return prev;
      });
    }, 5000);
  }, []);

  const moveTodo = useCallback(
    (todo: ITodo) => {
      if (todo.type === FRUIT) {
        setFruitList((prev) => [...prev, todo]);
      } else if (todo.type === VEGETABLE) {
        setVegetableList((prev) => [...prev, todo]);
      }

      setTodoList((prev) => filterTodoByName(prev, todo));
      autoRemoveTodo(todo);
    },
    [autoRemoveTodo]
  );

  const removeTodo = useCallback((todo: ITodo) => {
    if (todo.type === FRUIT) {
      setFruitList((prev) => filterTodoByName(prev, todo));
    } else if (todo.type === VEGETABLE) {
      setVegetableList((prev) => filterTodoByName(prev, todo));
    }

    setTodoList((prev) => [...prev, todo]);
    setRemoveQueueList((prev) => {
      return filterTodoByName(prev, todo);
    });
  }, []);

  return (
    <main className="grid grid-cols-8 gap-2 pt-12 h-screen">
      <div className="col-span-1"></div>
      <div className="col-span-2 h-[40rem] bg-white overflow-auto">
        {todoList.map((todo) => (
          <button
            className="block w-9/12 mx-auto mb-2 p-2 border-2 hover:bg-gray-100"
            key={todo.name}
            onClick={() => moveTodo(todo)}
          >
            {todo.name}
          </button>
        ))}
      </div>
      <div className="col-span-2 h-[40rem] bg-white border-2">
        <table className="w-full">
          <thead>
            <tr>
              <td className="border border-slate-300 box-border p-4 text-center bg-gray-300">
                Fruit
              </td>
            </tr>
          </thead>
          <tbody>
            {fruitList.map((fruit) => (
              <tr key={fruit.name}>
                <td>
                  <button
                    className="block mx-auto w-9/12 p-2 border-2 hover:bg-gray-100 mt-2"
                    onClick={() => removeTodo(fruit)}
                  >
                    {fruit.name}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="col-span-2 h-[40rem] bg-white border-2">
        <table className="w-full">
          <thead>
            <tr>
              <td className="border border-slate-300 box-border p-4 text-center bg-gray-300">
                Vegetable
              </td>
            </tr>
          </thead>
          <tbody>
            {vegetableList.map((vegetable) => (
              <tr key={vegetable.name}>
                <td>
                  <button
                    className="block mx-auto w-9/12 p-2 border-2 hover:bg-gray-100 mt-2"
                    onClick={() => removeTodo(vegetable)}
                  >
                    {vegetable.name}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

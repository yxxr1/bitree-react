import React, { useEffect, useState, useCallback } from 'react';
import { Tree } from "./components/Tree";
import { Form } from "./components/Form";
import { BiTree } from "./biTree";

const INITIAL_NUMBERS_COUNT_MIN = 8;
const INITIAL_NUMBERS_COUNT_MAX = 24;
const RANDOM_MIN = 10;
const RANDOM_MAX = 99;

const getRandomInt = (min: number, max: number) => {
  return Math.round(min + Math.random() * (max-min));
}

const biTree = new BiTree();

function App() {
  const [data, setData] = useState<(number | null)[][]>([]);
  const updateData = () => {
    setData(biTree.flattenTree());
  }

  const onRandomGen = useCallback(() => {
    const numbers = new Set<number>();

    const count = getRandomInt(INITIAL_NUMBERS_COUNT_MIN, INITIAL_NUMBERS_COUNT_MAX);

    while (numbers.size < count) {
      numbers.add(getRandomInt(RANDOM_MIN, RANDOM_MAX));
    }

    biTree.buildTree(Array.from(numbers));

    updateData();
  }, []);

  useEffect(() => {
    onRandomGen();
  }, [onRandomGen]);

  const onAdd = (value: number) => {
    if (biTree.addNode(value)) {
      updateData();
      alert("Значение добавлено");
    } else {
      alert("Значение существует");
    }
  }
  const onDelete = (value: number) => {
    if (biTree.deleteNode(value)) {
      updateData();
      alert("Значение удалено");
    } else {
      alert("Значение не найдено");
    }
  }
  const onFind = (value: number) => {
    if (biTree.findValue(value)) {
      alert("Значение найдено");
    } else {
      alert("Значение не найдено");
    }
  }
  const onNodeClick = (subTreeValue: number) => {
    const value = prompt("search value");

    if (value) {
      if (biTree.findValue(parseInt(value), subTreeValue)) {
        alert("Значение найдено");
      } else {
        alert("Значение не найдено");
      }
    }
  }
  const onRebuildClick = () => {
    biTree.buildTree(biTree.widthTraverse());
    updateData();
  }

  return (
      <div>
        <Form onAdd={onAdd} onDelete={onDelete} onFind={onFind} onRandomGen={onRandomGen} onRebuildClick={onRebuildClick} />
        <Tree data={data} onNodeClick={onNodeClick} />
      </div>
  );
}

export default App;

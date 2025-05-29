interface TreeNode {
    value: number;
    left: TreeNode | null;
    right: TreeNode | null;
}
interface EmptyTreeNode {
    value: number | null;
    left: EmptyTreeNode | null;
    right: EmptyTreeNode | null;
}

export class BiTree {
    tree: TreeNode | null = null;

    constructor(values?: number[]) {
        if (values) {
            this.buildTree(values);
        }
    }

    buildTree(data: number[]) {
        // сортировка и удаление одинаковых значений из входных данных
        const sortedData = data.sort((a, b) => a - b).reduce<number[]>((acc, num, ind, arr) => {
            if (ind && arr[ind - 1] === num) {
                return acc;
            }

            acc.push(num);

            return acc;
        }, []);

        // рекурсивное построение дерева из отсортированного массива уникальных чисел
        const addNode = (leftIndex: number, rightIndex: number): TreeNode | null => {
            // длина текущего диапазона
            const rangeLength = rightIndex - leftIndex;

            if (!rangeLength) {
                return null;
            }

            // центр диапазона - значение текущей ноды
            const middleIndex = leftIndex + Math.floor(rangeLength / 2);

            return {
                value: sortedData[middleIndex],
                // левая нода - в диапазоне от начала текущего диапазона до текущей ноды
                // т.к. массив отсортирован, то значения будут меньше что соответствует структуре бинарного дерева
                left: addNode(leftIndex, middleIndex),
                // правая нода - в диапазоне от следующего элемента после элемента текущей ноды до конца текущего диапазона
                right: addNode(middleIndex + 1, rightIndex),
            };
        }

        this.tree = addNode(0, sortedData.length);
    }

    addNode(value: number): TreeNode | null {
        if (this.tree) {
            let currentNode: EmptyTreeNode = this.tree;

            // цикл  завершится когда будет найдено место для нужного значения
            while (currentNode.value !== null) {
                // меньше - поиск слева
                if (value < currentNode.value) {
                    // если меньше значений нет - записывается нода с пустым значением и цикл завершается
                    if (currentNode.left === null) {
                        currentNode.left = { value: null, left: null, right: null };
                    }

                    // переход к следующей ноде по дереву
                    currentNode = currentNode.left!;
                    // больше -= поиск справа
                } else if (value > currentNode.value) {
                    if (currentNode.right === null) {
                        currentNode.right = { value: null, left: null, right: null };
                    }

                    currentNode = currentNode.right!;
                } else {
                    // значение уже есть в дереве
                    return null;
                }
            }

            // запись значения в новую ноду
            currentNode.value = value;

            return currentNode as TreeNode;
        } else {
            // если дерево не было построено, вызывается buildTree с переданным значением
            this.buildTree([value]);

            return this.tree;
        }
    }

    _findValue(tree: TreeNode | null, value: number) {
        let currentNode: TreeNode | null = tree, currentNodeParent = null;

        // цикл продолжается пока есть ноды и значение не найдено
        while (currentNode !== null && currentNode.value !== value) {
            currentNodeParent = currentNode;

            if (value < currentNode.value) {
                currentNode = currentNode.left;
            } else if (value > currentNode.value) {
                currentNode = currentNode.right;
            }
        }

        return { node: currentNode, parentNode: currentNodeParent };
    }

    findValue(value: number, subTreeValue?: number): TreeNode | null {
        // если передано subTreeValue - поиск начинается с ноды с таким значением
        const searchRoot = subTreeValue !== undefined ? this._findValue(this.tree, subTreeValue).node : this.tree;
        return this._findValue(searchRoot, value).node;
    }

    // обход дерева в ширину
    widthTraverse(): number[] {
        const result = [];

        if (this.tree) {
            const queue = [this.tree];

            while(queue.length > 0) {
                const node = queue.shift()!;
                result.push(node.value);
                node.left && queue.push(node.left);
                node.right && queue.push(node.right);
            }
        }

        return result;
    }

    deleteNode(value: number): true | false {
        const { node, parentNode } = this._findValue(this.tree, value);

        // замена удаляемой ноды ноды
        const replaceNode = (newNode: TreeNode | null) => {
            if (parentNode) {
                if (parentNode.left === node) {
                    parentNode.left = newNode;
                } else {
                    parentNode.right = newNode;
                }
            } else {
                // если у ноды нет родителя - newNode новый корень
                this.tree = newNode;
            }
        }

        if (node) {
            if (node.left === null && node.right === null) {
                // если потомков нет - удаляем ноду
                replaceNode(null);
            } else if (node.left !== null && node.right !== null) {
                let newNodeParent = node;
                let newNode = node.right;

                // находим наименьшее значение справа (самое левое), т.к. оно будет больше всех значений слева от удаляемой ноды, но меньше всех справа
                while (newNode.left !== null) {
                    newNodeParent = newNode;
                    newNode = newNode.left;
                }

                if (newNodeParent === node) {
                    // если первая нода справа - наименьшая, то в нее переносится левая ветка удаляемой ноды
                    // ветка справа остается, ветка слева была null, т.к. нода наименьшая
                    newNode.left = node.left;
                } else {
                    // слева ветка null, т.к. нода наименьшая
                    // правая ветка переносится на место этой ноды
                    newNodeParent.left = newNode.right;
                    // нода получает потомков удаляемой ноды
                    newNode.left = node.left;
                    newNode.right = node.right;
                }

                // замена удаляемой ноды на найденную
                replaceNode(newNode);
            } else {
                // если есть 1 потомок - переносим его родителю
                const newNode = node.left || node.right;

                replaceNode(newNode);
            }

            return true;
        }

        return false;
    }

    // возвращает структуру для визуализации
    flattenTree(): (number | null)[][] {
        const result: (number | null)[][] = [];

        const flatten = (nodes: (TreeNode | null)[]) => {
            // если все ноды пустые - завершение рекурсии
            if (!nodes.filter(node => node).length) return;

            // в результирующий массив добавляются значения нод на этом уровне
            result.push(nodes.map(node => typeof node?.value === "number" ? node?.value : null));

            // массив потомков всех нод на текущем уровне
            const children = nodes.reduce<(TreeNode | null)[]>((acc, node) => {
                if (node) {
                    acc.push(node.left, node.right);
                } else {
                    // если ноды нет - потомки null
                    acc.push(null, null);
                }

                return acc;
            }, []);

            flatten(children);
        }

        flatten([this.tree]);

        return result;
    }
}
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
        const sortedData = data.sort((a, b) => a - b).reduce<number[]>((acc, num, ind, arr) => {
            if (ind && arr[ind - 1] === num) {
                return acc;
            }

            acc.push(num);

            return acc;
        }, []);

        const addNode = (leftIndex: number, rightIndex: number): TreeNode | null => {
            const rangeLength = rightIndex - leftIndex;

            if (!rangeLength) {
                return null;
            }

            const middleIndex = leftIndex + Math.floor(rangeLength / 2);

            return {
                value: sortedData[middleIndex],
                left: addNode(leftIndex, middleIndex),
                right: addNode(middleIndex + 1, rightIndex),
            };
        }

        this.tree = addNode(0, sortedData.length);
    }

    addNode(value: number): TreeNode | null {
        if (this.tree) {
            let currentNode: EmptyTreeNode = this.tree;

            while (currentNode.value !== null) {
                if (value < currentNode.value) {
                    if (currentNode.left === null) {
                        currentNode.left = { value: null, left: null, right: null };
                    }

                    currentNode = currentNode.left!;
                } else if (value > currentNode.value) {
                    if (currentNode.right === null) {
                        currentNode.right = { value: null, left: null, right: null };
                    }

                    currentNode = currentNode.right!;
                } else {
                    return null;
                }
            }

            currentNode.value = value;

            return currentNode as TreeNode;
        } else {
            this.buildTree([value]);

            return this.tree;
        }
    }

    _findValue(tree: TreeNode | null, value: number) {
        let currentNode: TreeNode | null = tree, currentNodeParent = null;

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
        const searchRoot = subTreeValue !== undefined ? this._findValue(this.tree, subTreeValue).node : this.tree;
        return this._findValue(searchRoot, value).node;
    }

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

        const replaceNode = (parentNode: TreeNode, newNode: TreeNode | null) => {
            if (parentNode.left === node) {
                parentNode.left = newNode;
            } else {
                parentNode.right = newNode;
            }
        }

        if (node) {
            if (node.left === null && node.right === null) {
                if (parentNode) {
                    replaceNode(parentNode, null);
                } else {
                    this.tree = null;
                }
            } else if (node.left !== null && node.right !== null) {
                let newNodeParent = node;
                let newNode = node.right;

                while (newNode.left !== null) {
                    newNodeParent = newNode;
                    newNode = newNode.left;
                }

                if (newNodeParent === node) {
                    newNode.left = node.left;
                } else {
                    newNodeParent.left = newNode.right;
                    newNode.left = node.left;
                    newNode.right = node.right;
                }

                if (parentNode) {
                    replaceNode(parentNode, newNode);
                } else {
                    this.tree = newNode;
                }
            } else {
                const newNode = node.left || node.right;

                if (parentNode) {
                    replaceNode(parentNode, newNode);
                } else {
                    this.tree = newNode;
                }
            }

            return true;
        }

        return false;
    }

    flattenTree(): (number | null)[][] {
        const result: (number | null)[][] = [];

        const flatten = (nodes: (TreeNode | null)[]) => {
            if (!nodes.filter(node => node).length) return;

            result.push(nodes.map(node => typeof node?.value === "number" ? node?.value : null));

            const children = nodes.reduce<(TreeNode | null)[]>((acc, node) => {
                if (node) {
                    acc.push(node.left, node.right);
                } else {
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
class Node {
  constructor(data, left, right) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}

class Tree {
  constructor(array) {
    let sortedArray = arraySort(array);
    this.root = this.buildTree(sortedArray);
  }

  buildTree(arr) {
    let array = arraySort(arr);
    if (array.length === 0) return null;

    let mid = Math.floor(array.length / 2);
    let root = new Node(
      array[mid],
      this.buildTree(array.slice(0, mid)),
      this.buildTree(array.slice(mid + 1))
    );
    return root;
  }

  insert(data) {
    let newNode = new Node(data, null, null);
    if (this.root === null) {
      this.root = newNode;
      return this;
    }
    let current = this.root;
    while (current !== null) {
      if (data === current.data) return undefined;
      if (data < current.data) {
        if (current.left === null) {
          current.left = newNode;
          return;
        } else {
          current = current.left;
        }
      } else {
        if (current.right === null) {
          current.right = newNode;

          return this;
        } else {
          current = current.right;
        }
      }
    }
  }

  remove(data) {
    const removeNode = (root, data) => {
      if (root === null) return root;
      if (data < root.data) {
        root.left = removeNode(root.left, data);
      } else if (data > root.data) {
        root.right = removeNode(root.right, data);
      } else {
        if (root.left === null) {
          return root.right;
        } else if (root.right === null) {
          return root.left;
        }
        const minimumVal = (root) => {
          let minValue = root.data;
          while (root.left != null) {
            minValue = root.left.data;
            root = root.left;
          }
          return minValue;
        };
        root.data = minimumVal(root.right);
        root.right = removeNode(root.right, root.data);
      }
      return root;
    };
    this.root = removeNode(this.root, data);
  }

  find(data) {
    const findNode = (node, data) => {
      if (node === null) return null;
      if (data < node.data) {
        return findNode(node.left, data);
      } else if (data > node.data) {
        return findNode(node.right, data);
      } else {
        return node;
      }
    };
    findNode(this.root, data);
  }

  levelOrder(callback) {
    if (this.root === null) return [];
    let queue = [this.root];
    let result = [];
    while (queue.length > 0) {
      let current = [];
      let length = queue.length;
      for (let i = 0; i < length; i++) {
        let node = queue.shift();
        current.push(node.data);
        if (node.left) {
          queue.push(node.left);
        }
        if (node.right) {
          queue.push(node.right);
        }
        if (callback) {
          callback(node);
        }
      }
      result.push(current);
    }
    if (!callback) return result;
  }

  inorder(callback) {
    let result = [];
    const inorderTraversal = (node, callback) => {
      if (node === null) return;
      inorderTraversal(node.left, callback);
      if (callback) {
        callback(node.data);
      }
      result.push(node.data);
      inorderTraversal(node.right, callback);
    };
    inorderTraversal(this.root, callback);
    return result;
  }

  preorder(callback) {
    let result = [];
    const preorderTraversal = (node, callback) => {
      if (node === null) return;
      result.push(node.data);
      if (callback) {
        callback(node.data);
      }
      preorderTraversal(node.left, callback);
      preorderTraversal(node.right, callback);
    };
    preorderTraversal(this.root, callback);
    return result;
  }

  postorder(callback) {
    let result = [];
    const postorderTraversal = (node, callback) => {
      if (node === null) return;
      postorderTraversal(node.left, callback);
      postorderTraversal(node.right, callback);
      result.push(node.data);
      if (callback) {
        callback(node.data);
      }
    };
    console.log(this.root);
    postorderTraversal(this.root, callback);
    return result;
  }

  height(node = this.root) {
    if (node === null) return 0;

    let left = this.height(node.left);
    let right = this.height(node.right);

    if (left > right) {
      return left + 1;
    } else {
      return right + 1;
    }
  }

  depth(data) {
    if (!this.root) return -1;
    const findDepth = (data, node, dist = -1) => {
      if (data === node.data) return dist + 1;
      if (data < node.data) {
        return findDepth(data, node.left, dist + 1);
      } else if (data > node.data) {
        return findDepth(data, node.right, dist + 1);
      }
      return dist;
    };
    return findDepth(data, this.root);
  }

  isBalanced() {
    const findMin = (node) => {
      if (node === null) return 0;
      return 1 + Math.min(findMin(node.left), findMin(node.right));
    };

    let node = this.root;
    let max = this.height();
    let min = findMin(node);
    if (max - min <= 1) return true;
    return false;
  }

  rebalance() {
    let array = this.inorder();
    this.root = this.buildTree(array);
    return this;
  }

  prettyPrint = (node = this.root, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };
}

//Sort Array

function arraySort(arr) {
  let map = {};
  let sortedArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (!map[arr[i]]) {
      map[arr[i]] = true;
      sortedArr.push(arr[i]);
    }
  }
  return sortedArr.sort((a, b) => a - b);
}

//Create Random Array

function createRandomTree() {
  let arr = new Array(10);
  arr = arr.fill(0).map(() => Math.floor(Math.random() * 100));
  return arr;
}

//Driver

function driver() {
  let tree = new Tree(createRandomTree());
  console.log(tree.isBalanced()); //true
  console.log("Level Order: ", tree.levelOrder());
  console.log("Inorder: ", tree.inorder());
  console.log("Preorder: ", tree.preorder());
  console.log("Postorder: ", tree.postorder());
  tree.insert(198);
  tree.insert(350);
  tree.insert(127);
  tree.insert(265);
  tree.insert(239);
  console.log(tree.isBalanced());
  tree.rebalance();
  console.log(tree.isBalanced());
  console.log("Level Order: ", tree.levelOrder());
  console.log("Inorder: ", tree.inorder());
  console.log("Preorder: ", tree.preorder());
  console.log("Postorder: ", tree.postorder());
  tree.prettyPrint();
}
driver();

import { todoJsonApi } from "../store/services/todo/todo-json.api";
import { todoApi } from "../store/services/todo/todo.api";
import { ISortByPosition, ITodoEditFields, ITodoItem } from "../types/todo.types";
import { todoSectionsApi } from "../store/services/todo/todo-sections.api";
import { useActions } from "./useActions";
import { useAppSelector } from "./useAppSelector";
import bcrypt from 'bcryptjs';

interface IMutateList {
    field: string,
    value: any
}

export const useTaskTree = () => {
    let { todos, todosItems } = useAppSelector((state) => state.todosReducer);
    const [createTodo] = todoApi.useAddMutation();
    const [removeTodo] = todoApi.useRemoveMutation();
    const [addTodoItemsJson] = todoJsonApi.useAddItemsMutation();
    const [addTodoSectionsJson] = todoJsonApi.useAddSectionsMutation();
    const { setTodos, setTodoItems } = useActions();
    const [addSection] = todoSectionsApi.useAddMutation();
    const [removeSection] = todoSectionsApi.useRemoveMutation();

    const recursiveCloneTree = (tree: ITodoItem[]): ITodoItem[] => {
        let clonesList = [];

        const cloneRecursive = (tree: ITodoItem[]): ITodoItem[] => {
            let arrClones = [];
            for (let inc in tree) {
                if (Array.isArray(tree[inc])) {
                    arrClones.push({ ...tree[inc] });
                } else {
                    const newItems: ITodoItem[] = cloneRecursive(tree[inc].items);
                    arrClones.push({ ...tree[inc], items: newItems });

                }
            }
            return arrClones;
        }

        for (let inc in tree) {
            let cloneObj = { ...tree[inc] };
            cloneObj.items = cloneRecursive(tree[inc].items);
            clonesList.push(cloneObj);
        }

        return clonesList;
    }

    const findTaskInTree = (tree: ITodoItem[], taskId: string): ITodoItem | false => {
        const recursiveFind = (tree: ITodoItem[], taskId: string): ITodoItem | undefined => {
            for (let inc in tree) {
                if (tree[inc].id && tree[inc].id === taskId) {
                    return tree[inc];
                } else {
                    if (tree[inc].items && tree[inc].items.length) {
                        const foundTask = recursiveFind(tree[inc].items, taskId);
                        if (foundTask !== undefined && foundTask.id && foundTask.id === taskId) {
                            return foundTask;
                        } else {
                            recursiveFind(tree[inc].items, taskId);
                        }
                    }
                }
            }
        }

        for (let inc in tree) {
            if (tree[inc].id === taskId) {
                return tree[inc];
            }
        }

        for (let inc in tree) {
            const task = recursiveFind(tree[inc].items, taskId);
            if (task !== undefined && task.id === taskId) {
                return task;
            }
        }
        return false;
    }

    const mutateTask = async (taskId: string, mutateList: IMutateList[]): Promise<ITodoItem> => {
        const tasksclones = recursiveCloneTree(todos);
        const foundTask: any = findTaskInTree(tasksclones, taskId);
        if (foundTask) {
            mutateList.map((item) => {
                foundTask[item.field] = item.value;
            })
        }
        await setTodos({ data: tasksclones });
        return foundTask;
    }

    const createTask = async (taskId: string, editFields: ITodoEditFields, position?: string) => {

        const salt = bcrypt.genSaltSync(10) + Date.now();
        const newTaskId = bcrypt.hashSync(editFields.name + editFields.description, salt);

        const tasksclones = recursiveCloneTree(todos);
        const foundTask = findTaskInTree(tasksclones, taskId);

        const create = async (foundTask: ITodoItem | false, sortByPosition?: ISortByPosition) => {
            if (foundTask && foundTask.items) {
                let sort = 0;
                const lastTask = foundTask.items[foundTask.items.length - 1];
                if (lastTask) {
                  sort = lastTask.sort + 1;
                }
    
                if (sortByPosition) {
                    const {sortPosition, position} = sortByPosition;
                    if (sortPosition !== undefined) {
                        foundTask.items.map((item) => {
                            if (position === "upper") {
                                if (item.sort >= sortPosition) {
                                    item.sort = item.sort + 1;
                                }
                            } else {
                                if (item.sort <= sortPosition) {
                                    item.sort = item.sort - 1;
                                }
                            }
                        })
                        sort = sortPosition;
                    }
                }

                const items: ITodoItem[] = foundTask.items;
                const todoItem: ITodoItem = {
                    ...editFields,
                    showTasks: true,
                    id: newTaskId,
                    sort,
                    parentId: foundTask.id,
                    items: [],
                    isComplete: false,
                    editable: false,
                    creatableLower: false,
                    creatableUpper: false,
                    creatable: false
                };

                items.push(todoItem);
                if (foundTask.type === "section") {
                    todoItem.parentId = null;
                    todoItem.sectionId = foundTask.id;
                } else {           
                    todoItem.sectionId = foundTask.sectionId;
                }

                createTodo(todoItem);

                foundTask.items.sort((a, b) => a.sort - b.sort);
                await setTodos({ data: tasksclones });

                const itemsClone = items.map((item) => {
                    return { ...item };
                })

                if (foundTask.type === "section") {
                    itemsClone.map((item) => {
                        item.parentId = null;
                    })
                }

                const itemsIds = itemsClone.map((item) => item.id);
                const newTodoItems = todosItems.filter((todoItem) => {
                    if (!itemsIds.includes(todoItem.id)) {
                        return todoItem;
                    }
                });

                const data = itemsClone.concat(newTodoItems);
                setTodoItems({ data });
                if (sortByPosition) {
                    addTodoItemsJson({jsonData: data});
                }
            }
        }

        if (foundTask) {
            if (position && foundTask.parentId) {
                const foundParentTask = findTaskInTree(tasksclones, foundTask.parentId);
                create(foundParentTask, { sortPosition: foundTask.sort, position });
            } else {
                if (position && foundTask.sectionId) {
                    const foundParentTask = findTaskInTree(tasksclones, foundTask.sectionId);
                    create(foundParentTask, { sortPosition: foundTask.sort, position });
                } else {
                    create(foundTask);
                }
            }
        }
    }

    const createSection = async (name: string, sort: number) => {
        const salt = bcrypt.genSaltSync(10) + Date.now();
        const id = bcrypt.hashSync(name, salt);

        const tasksclones = recursiveCloneTree(todos);
       
        const sectonObj: ITodoItem = {
            id,
            name,
            showTasks: true,
            parentId: null,
            sectionId: '79d5bf69e1ae15ea916a9365af3401d5',
            description: "",
            type: "section",
            sort: 0,
            creatable: false,
            editable: false,
            creatableLower: false,
            creatableUpper: false,
            isComplete: false,
            items: []
        };
       
        tasksclones.map((item) => {
            if (item.sort <= sort) {
                item.sort = item.sort - 1;
            }

            if (item.sort >= sort) {
                item.sort = item.sort + 1;
            }
        });        

        sectonObj.sort = sort;
        tasksclones.push(sectonObj);
        tasksclones.sort((a, b) => a.sort - b.sort);
        await setTodos({ data: tasksclones });
        await addTodoSectionsJson({jsonData: tasksclones});
        await addSection(sectonObj);
    }

    const getFieldRecursive = (tree: ITodoItem[], field: string) => {
        const listFields: string[] = [];
        const getField = (tree: ITodoItem[], field: string) => {
            tree.map((item) => {
                listFields.push(item[field]);
                getField(item.items, field);
            });
        }

        getField(tree, field);
        return listFields;
    }

    const removeTask = async (taskId: string, isSection: boolean = false) => {
        let tasksclones = recursiveCloneTree(todos);
        const foundTask = findTaskInTree(tasksclones, taskId);

        const filter = (tasks: ITodoItem[]) => {
            const filteredTasks = tasks.filter((task) => {
                if (task.id !== taskId) {
                    return task;
                }
            });
            return filteredTasks;
        }

        const remove = async (foundTask: ITodoItem) => {
            const todoRemoveList = getFieldRecursive(foundTask.items, "id");
            todoRemoveList.push(foundTask.id);
            
            if (isSection) {
                tasksclones = filter(tasksclones);
                await removeTodo(todoRemoveList);
                await removeSection({id: foundTask.id});
            } else {
                const filteredItems = filter(foundTask.items);
                foundTask.items = filteredItems;
                removeTodo(todoRemoveList);
            } 
        }
        
        if (foundTask) {
            if (isSection) {
                remove(foundTask);
            } else {
                if (foundTask.parentId) {
                    const foundParentTask = findTaskInTree(tasksclones, foundTask.parentId);
                    if (foundParentTask) {
                        remove(foundParentTask);
                    }
                }
            }
        }

        setTodos({ data: tasksclones });
    }

    const mutateAllTasks = (mutateCallback: (obj: ITodoItem) => void) => {
        const tasksclones = recursiveCloneTree(todos);
        const recursiveMutate = (tree: ITodoItem[]) => {
            for (let inc in tree) {
                mutateCallback(tree[inc]);
                if (tree[inc].items && tree[inc].items.length) {
                    recursiveMutate(tree[inc].items);
                }
            }
        }
        recursiveMutate(tasksclones);
        setTodos({ data: tasksclones });
        return tasksclones;
    }

    return {
        findTaskInTree,
        recursiveCloneTree,
        mutateTask,
        createTask,
        removeTask,
        mutateAllTasks,
        createSection
    };
}
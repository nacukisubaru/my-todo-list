import { ITodoEditFields, ITodoItem, ITodoSection } from "../types/todo.types";
import { useActions } from "./useActions";
import { useAppSelector } from "./useAppSelector";
import bcrypt from 'bcryptjs';

interface ITaskParams {
    taskId: number,
    type: string
}

interface IMutateList {
    field: string, 
    value: any
}

export const useTaskTree = () => {
    let todos = useAppSelector((state) => state.todosReducer.todos);
    const { setTodos } = useActions();
    
    const recursiveCloneTree = (tree: ITodoSection[]): ITodoSection[] => {
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


    const findTaskInTree = (tree: ITodoSection[], taskId: number | string, type: string): ITodoItem | ITodoSection | false => {
        const recursiveFind = (tree: ITodoItem[], taskId: number | string): ITodoItem | undefined => {
            for (let inc in tree) {
                if (tree[inc].id && tree[inc].id === taskId && tree[inc].type === "task") {
                    return tree[inc];
                } else {
                    if (tree[inc].items && tree[inc].items.length) {
                        const foundTask = recursiveFind(tree[inc].items, taskId);
                        if (foundTask !== undefined && foundTask.id && foundTask.id === taskId && tree[inc].type === "task") {
                            return foundTask;
                        } else {
                            recursiveFind(tree[inc].items, taskId);
                        }
                    }
                }
            }
        }

        if (type === "section") {
            for (let inc in tree) {
                if (tree[inc].type === "section" && tree[inc].id === taskId) {
                    return tree[inc];
                }
            }
        } else {
            for (let inc in tree) {
                const task = recursiveFind(tree[inc].items, taskId);
                if (task !== undefined && task.id === taskId) {
                    return task;
                }
            }
        }

        return false;
    }

    const mutateTask = async (taskId: number | string, mutateList: IMutateList[], type: string): Promise<ITodoSection[]> => {
        const tasksclones: ITodoSection[] = recursiveCloneTree(todos);
        const foundTask: ITodoSection | ITodoItem | false | any = findTaskInTree(tasksclones, taskId, type);
        if (foundTask) {
            mutateList.map((item) => {
                foundTask[item.field] = item.value;
            })   
        }
        await setTodos({ data: tasksclones });
        return tasksclones;
    }

    const createTask = async (tasksParams: ITaskParams, editFields: ITodoEditFields) => {
        const salt = bcrypt.genSaltSync(10) + Date.now();
        const newTaskId = bcrypt.hashSync(editFields.name + editFields.description, salt);

        const {taskId, type} = tasksParams;
        const tasksclones: ITodoSection[] = recursiveCloneTree(todos);
        const foundTask: any = findTaskInTree(tasksclones, taskId, type);
        if (foundTask && foundTask.items) {
            foundTask.items.push({...editFields, type: 'task', showTasks: true, items: [], id: newTaskId});
            await setTodos({ data: tasksclones });
        }
    }

    const mutateAllTasks = (mutateCallback: (obj: ITodoSection | ITodoItem) => void) => {
        const tasksclones: ITodoSection[] = recursiveCloneTree(todos);
        const recursiveMutate = (tree: ITodoSection[] | ITodoItem[]) => {
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

    return { findTaskInTree, recursiveCloneTree, mutateTask, createTask, mutateAllTasks };
}
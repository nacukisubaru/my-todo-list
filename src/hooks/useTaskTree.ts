import { ITodoEditFields, ITodoItem, ITodoList } from "../types/todo.types";
import { useActions } from "./useActions";
import { useAppSelector } from "./useAppSelector";
import bcrypt from 'bcryptjs';

interface ITaskParams {
    taskId: number,
    type: string
}

export const useTaskTree = () => {
    let todos = useAppSelector((state) => state.todosReducer.todos);
    const { setTodos } = useActions();
    
    const recursiveCloneTree = (tree: ITodoList[]): ITodoList[] => {
        let clonesList = [];

        const cloneRecursive = (tree: ITodoList[]) => {
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


    const findTaskInTree = (tree: ITodoList[], taskId: number, type: string): ITodoItem | false => {
        const recursiveFind = (tree: ITodoList[], taskId: number): ITodoItem | undefined => {
            for (let inc in tree) {
                if (tree[inc].id && tree[inc].id === taskId && tree[inc].type === "task") {
                    return tree[inc];
                } 
                else {
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


    const mutateTask = async (taskId: number, field: string, value: any, type: string): Promise<ITodoList[]> => {
        const tasksclones: ITodoList[] = recursiveCloneTree(todos);
        const foundTask: any = findTaskInTree(tasksclones, taskId, type);
        if (foundTask) {
            foundTask[field] = value;
        }
        await setTodos({ data: tasksclones });
        return tasksclones;
    }

    const createTask = async (tasksParams: ITaskParams, editFields: ITodoEditFields) => {
        const salt = bcrypt.genSaltSync(10) + Date.now();
        const newTaskId = bcrypt.hashSync(editFields.name + editFields.description, salt);

        const {taskId, type} = tasksParams;
        const tasksclones: ITodoList[] = recursiveCloneTree(todos);
        const foundTask: any = findTaskInTree(tasksclones, taskId, type);
        foundTask.items.push({...editFields, type: 'task',  showTasks: true, items: [], id: newTaskId});
        await setTodos({ data: tasksclones });
    }

    return { findTaskInTree, recursiveCloneTree, mutateTask, createTask };
}
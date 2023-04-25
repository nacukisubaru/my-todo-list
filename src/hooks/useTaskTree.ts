import { ITodoItem, ITodoList } from "../types/todo.types";
import { useActions } from "./useActions";

export const useTaskTree = () => {
    const {setTodos} = useActions();
    const recursiveCloneTree = (tree: ITodoList[]): ITodoList[] => {
        let clonesList = [];
    
        const cloneRecursive = (tree:ITodoList[]) => {
            let arrClones = [];
            for (let inc in tree) {
                if (Array.isArray(tree[inc])) {
                    arrClones.push({...tree[inc]});
                } else {
                    const newItems: ITodoItem[] = cloneRecursive(tree[inc].items);
                    arrClones.push({...tree[inc], items: newItems });
                    
                }
            }
            return arrClones;
        }
    
        for (let inc in tree) {
            let cloneObj = {...tree[inc]};
            cloneObj.items = cloneRecursive(tree[inc].items);
            clonesList.push(cloneObj);
        }
    
        return clonesList;
    }
    
    
    const findTaskInTree = (tree: ITodoList[], taskId: number, type: string): ITodoItem | boolean => {
        const recursiveFind = (tree: ITodoList[], taskId: number): ITodoItem | undefined => {
            for (let inc in tree) {
                if (tree[inc].id && tree[inc].id === taskId && tree[inc].type === "task") {
                    return tree[inc];
                }
                else {
                    if (tree[inc].items && tree[inc].items.length) {
                        return recursiveFind(tree[inc].items, taskId);
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


    const mutateTask = async (tasks: ITodoList[], taskId: number, field: string, value:any, type: string): Promise<ITodoList[]> => {
        const tasksclones:ITodoList[] = recursiveCloneTree(tasks);
        const foundTask:any = findTaskInTree(tasksclones, taskId, type);
        if (foundTask) {
            foundTask[field] = value;
        }
        await setTodos({data:tasksclones});
        return tasksclones;
    }

    return {findTaskInTree, recursiveCloneTree, mutateTask};
}
import { todoJsonApi } from "../store/services/todo/todo-json.api";
import { todoApi } from "../store/services/todo/todo.api";
import { ISectionEditFields, ISortByPosition, ITodoEditFields, ITodoItem, taskType } from "../types/todo.types";
import { todoSectionsApi } from "../store/services/todo/todo-sections.api";
import { useActions } from "./useActions";
import { useAppSelector } from "./useAppSelector";
import { sectionsApi } from "../store/services/sections/sections.api";
import { IMutateList } from "../types/ui.types";
import { DraggableLocation } from "react-beautiful-dnd";
import bcrypt from 'bcryptjs';

interface ICreateTaskSectionParams {
    name: string,
    sort: number,
    editFields?: ITodoEditFields,
    sortFunc?: (items: ITodoItem[]) => void
}

interface ICreateSectionParams {
    sectionId: string,
    editFields: ISectionEditFields,
    sortByPosition: ISortByPosition,
    subsection?: boolean,
    sectionsList?: ITodoItem[]
}


export const useTaskTree = () => {
    let { todos, todosItems, currentTodo } = useAppSelector((state) => state.todosReducer);
    let { sections, sectionItems, currentSection } = useAppSelector((state) => state.sectionsReducer);
    const { isVisibleDetailTodo } = useAppSelector((state => state.uiReducer));
    const [createTodo] = todoApi.useAddMutation();
    const [removeTodo] = todoApi.useRemoveMutation();
    const [addTodoItemsJson] = todoJsonApi.useAddItemsMutation();
    const [addTodoSectionsJson] = todoJsonApi.useAddTodoSectionsMutation();
    const [addSectionsJson] = todoJsonApi.useAddSectionsMutation();
    const { setTodos, setTodoItems, setSectionItems, setSections } = useActions();
    const [addTodoSection] = todoSectionsApi.useAddMutation();
    const [removeSection] = todoSectionsApi.useRemoveMutation();
    const [addSection] = sectionsApi.useAddMutation();
    const { setCurrentTodo } = useActions();

    const generateTaskId = (params?: any) => {
        const salt = bcrypt.genSaltSync(10) + Date.now();
        const arrayParams = Object.values(params);
        const strParams: any = arrayParams.reduce((paramPrev: any, paramNext: any) => {
            return paramPrev + paramNext;
        });

        const taskId = bcrypt.hashSync(strParams, salt);
        return taskId.replaceAll('/', '').replaceAll('.', '');
    }

    const recursiveCloneTree = (tree: ITodoItem[] | any[]): ITodoItem[] | any[] => {
        let clonesList = [];

        const cloneRecursive = (tree: ITodoItem[] | any[]): ITodoItem[] | any[] => {
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

    const mutateTask = async (taskId: string, mutateList: IMutateList[], changeSection: boolean = false, isDetailTodo: boolean = false): Promise<ITodoItem> => {
        let tasks;
        if (changeSection) {
            tasks = sections;
        } else {
            tasks = todos;
        }

        if (isDetailTodo) {
            tasks = [currentTodo];
        }

        const tasksclones = recursiveCloneTree(tasks);
        const foundTask: any = findTaskInTree(tasksclones, taskId);
        if (foundTask) {
            mutateList.map((item) => {
                foundTask[item.field] = item.value;
            });
        }

        if (isDetailTodo) {
            setCurrentTodo({ todo: tasksclones[0] });
        } else {
            if (changeSection) {
                await setSections({ data: tasksclones });
            } else {
                await setTodos({ data: tasksclones });
            }
        }

        return foundTask;
    }

    const setJsonItems = (items: ITodoItem[], jsonItems: ITodoItem[], taskType?: taskType, createSection: boolean = false) => {
        const itemsClone = items.map((item) => {
            return { ...item };
        })

        if (taskType === "section") {
            itemsClone.map((item) => {
                item.parentId = null;
            })
        }

        const itemsIds = itemsClone.map((item) => item.id);
        const newTodoItems = jsonItems.filter((item) => {
            if (!itemsIds.includes(item.id)) {
                return item;
            }
        });

        const data = itemsClone.concat(newTodoItems);

        const set = (setItems: ({ data }: any) => void, addItemsJson: ({ jsonData }: any) => void) => {
            setItems({ data });
            addItemsJson({ jsonData: data });
        }

        if (createSection) {
            set(setSectionItems, addSectionsJson);
        } else {
            set(setTodoItems, addTodoItemsJson);
        }
    }

    const sortPositions = (tasks: ITodoItem[], sortByPosition: ISortByPosition) => {
        const { sortPosition, position } = sortByPosition;
        if (sortPosition !== undefined) {
            tasks.map((item) => {
                if (position === "upper") {
                    if (item.sort >= sortPosition) {
                        item.sort = item.sort + 1;
                    }
                } else {
                    if (item.sort <= sortPosition) {
                        item.sort = item.sort - 1;
                    }
                }
            });
            return sortPosition;
        }
        return false;
    }

    const createTask = async (taskId: string, editFields: ITodoEditFields, position?: string, sort?: number) => {
        const newTaskId = generateTaskId(editFields);

        const tasksclones = recursiveCloneTree(todos);
        const foundTask = findTaskInTree(tasksclones, taskId);

        const create = async (foundTask: ITodoItem | false, sortByPosition?: ISortByPosition) => {
            if (foundTask && foundTask.items) {
                if (sort === undefined) {
                    sort = 0;
                    const lastTask = foundTask.items[foundTask.items.length - 1];
                    if (lastTask) {
                        sort = lastTask.sort + 1;
                    }

                    if (sortByPosition) {
                        const sortPos = sortPositions(foundTask.items, sortByPosition);
                        if (sortPos !== false) {
                            sort = sortPos;
                        }
                    }
                }
                const { name, description } = editFields;
                const todoItem: ITodoItem = {
                    name,
                    description,
                    showTasks: editFields.showTasks !== undefined ? editFields.showTasks : true,
                    id: editFields.id ? editFields.id : newTaskId,
                    sort,
                    parentId: foundTask.id,
                    items: editFields.items ? editFields.items : [],
                    isComplete: editFields.isComplete !== undefined ? editFields.isComplete : false,
                    editable: false,
                    creatableLower: false,
                    creatableUpper: false,
                    creatable: false
                };

                if (editFields.id && editFields.parentId) {
                    const parentEditableTask = findTaskInTree(tasksclones, editFields.parentId);
                    if (parentEditableTask) {
                        const itemsWithoutEditItem = parentEditableTask.items.filter((item) => {
                            if (item.id !== editFields.id) {
                                return item;
                            }
                        });
                        parentEditableTask.items = itemsWithoutEditItem;
                    }
                }

                foundTask.items.push(todoItem);
                if (foundTask.type === "section") {
                    todoItem.sectionId = foundTask.id;
                } else {
                    todoItem.sectionId = foundTask.sectionId;
                }

                foundTask.items.sort((a, b) => a.sort - b.sort);
                reindex(foundTask.items);
                await setTodos({ data: tasksclones });

                if (!editFields.id) {
                    const prepareCreate = { ...todoItem };
                    if (foundTask.type === "section") {
                        prepareCreate.parentId = null;
                    }
                    createTodo(prepareCreate);
                }

                if (sortByPosition) {
                    setJsonItems(foundTask.items, todosItems, foundTask.type, false);
                }

                return foundTask;
            }
        }

        if (foundTask) {
            if (position && foundTask.parentId) {
                const foundParentTask = findTaskInTree(tasksclones, foundTask.parentId);
                return create(foundParentTask, { sortPosition: foundTask.sort, position });
            } else {
                if (editFields.id && position) {
                    return create(foundTask, { sortPosition: foundTask.sort, position });
                }
                if (position && foundTask.sectionId) {
                    const foundParentTask = findTaskInTree(tasksclones, foundTask.sectionId);
                    return create(foundParentTask, { sortPosition: foundTask.sort, position });
                } else {
                    return create(foundTask);
                }
            }
        }
    }

    const createSection = async (params: ICreateSectionParams) => {
        const { sectionId, editFields, sortByPosition, subsection = false, sectionsList } = params;
        let { name, id, showSections, items } = editFields;
        let isEdit: boolean = false;
        if (!id) {
            id = generateTaskId(name);
        } else {
            isEdit = true;
        }

        if (showSections === undefined) {
            showSections = true;
        }

        if (!items) {
            items = [];
        }

        let tasksclones = sectionsList;
        if (!tasksclones) {
            tasksclones = recursiveCloneTree(sections);
        }

        const foundTask = findTaskInTree(tasksclones, sectionId);

        if (foundTask) {

            let sort = sortByPosition.sortPosition;
            let foundParentTask;
            let items: any;

            if (subsection) {
                items = foundTask.items;
                const lastTask = foundTask.items[foundTask.items.length - 1];
                if (lastTask) {
                    sort = lastTask.sort + 1;
                }
            } else {
                if (foundTask.parentId) {
                    foundParentTask = findTaskInTree(tasksclones, foundTask.parentId);
                    if (foundParentTask) {
                        items = foundParentTask.items;

                        if (isEdit) {
                            items = foundParentTask.items.filter((task) => {
                                if (task.id !== id) {
                                    return task;
                                }
                            })
                        }
                    }

                } else {
                    items = tasksclones;
                    if (isEdit) {
                        items = tasksclones.filter((task) => {
                            if (task.id !== id) {
                                return task;
                            }
                        })
                    }
                }
            }

            sortPositions(items, sortByPosition);
            const sectionItem: any = {
                id,
                name,
                showSections,
                sort,
                parentId: foundParentTask ? foundParentTask.id : null,
                items: editFields.items !== undefined ? editFields.items : [],
            };

            if (subsection) {
                sectionItem.parentId = foundTask.id;
            }

            items.push(sectionItem);
      
            items.sort((a: any, b: any) => a.sort - b.sort);

            reindex(items);
            console.log(items)

            if (!isEdit) {
                addSection(sectionItem);
            }

            setSections({ data: items });

            setJsonItems(items, sectionItems, foundTask.type, true);
        }
    }

    const createTaskSection = async (params: ICreateTaskSectionParams) => {
        const { name, sort, editFields, sortFunc } = params;

        let tasksclones = recursiveCloneTree(todos);
        let id = generateTaskId(name);
        let showTasks = true;

        if (editFields && editFields.id) {
            id = editFields.id;
            if (editFields.showTasks !== undefined) {
                showTasks = editFields.showTasks;
            }
        }

        const sectonObj: ITodoItem = {
            id,
            name,
            showTasks: showTasks,
            parentId: null,
            sectionId: currentSection.id,
            description: "",
            type: "section",
            sort: 0,
            creatable: false,
            editable: false,
            creatableLower: false,
            creatableUpper: false,
            isComplete: false,
            items: editFields && editFields.items ? editFields.items : []
        };

        if (sortFunc) {
            sortFunc(tasksclones);
        } else {
            tasksclones.map((item) => {
                if (item.sort <= sort) {
                    item.sort = item.sort - 1;
                }

                if (item.sort >= sort) {
                    item.sort = item.sort + 1;
                }
            });
        }

        if (editFields && editFields.id) {
            const itemsWithoutEditItem = tasksclones.filter((item) => {
                if (item.id !== editFields.id) {
                    return item;
                }
            });

            tasksclones = itemsWithoutEditItem;
        }

        sectonObj.sort = sort;
        tasksclones.push(sectonObj);
        tasksclones.sort((a, b) => a.sort - b.sort);
        reindex(tasksclones);
        await setTodos({ data: tasksclones });
        await addTodoSectionsJson({ jsonData: tasksclones });
        await addTodoSection(sectonObj);
    }

    const getFieldRecursive = (tree: ITodoItem[], field: string) => {
        const listFields: string[] = [];
        const getField = (tree: ITodoItem[], field: string) => {
            tree.map((item: any) => {
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

        const remove = async (foundTask: ITodoItem, parentTask?: ITodoItem) => {
            let todoRemoveList: string[] = [];

            if (isSection) {
                todoRemoveList = getFieldRecursive(foundTask.items, "id");
                todoRemoveList.push(foundTask.id);
                tasksclones = filter(tasksclones);
                await removeTodo(todoRemoveList);
                await removeSection({ id: foundTask.id });
            } else {
                if (parentTask) {
                    const filteredItems = filter(parentTask.items);
                    parentTask.items = filteredItems;

                    todoRemoveList = foundTask.items.map((item) => item.id);
                    todoRemoveList.push(foundTask.id);

                    removeTodo(todoRemoveList);
                }
            }

            if (isVisibleDetailTodo && parentTask) {
                setCurrentTodo({ todo: parentTask });
            }
        }

        if (foundTask) {
            if (isSection) {
                remove(foundTask);
            } else {
                if (foundTask.parentId) {
                    const foundParentTask = findTaskInTree(tasksclones, foundTask.parentId);
                    if (foundParentTask) {
                        remove(foundTask, foundParentTask);
                    }
                }
            }
        }

        setTodos({ data: tasksclones });
    }

    const mutateAllTasks = (mutateCallback: (obj: ITodoItem) => void, changeState: boolean = true) => {
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
        if (changeState) {
            setTodos({ data: tasksclones });
        }
        return tasksclones;
    }

    const completeTasks = (taskId: string, isComplete: boolean) => {
        const tasksclones = recursiveCloneTree(todos);
        const arrayJsonItems: ITodoItem[] = [];

        const recursiveComplete = (tree: ITodoItem[], depth: boolean = false) => {
            for (let inc in tree) {
                if (depth) {
                    tree[inc].items.map((item) => {
                        if (item.parentId === tree[inc].id && !item.isComplete) {
                            item.isComplete = isComplete;
                            arrayJsonItems.push(item);
                        }
                        recursiveComplete(tree[inc].items, true);
                    });
                } else {
                    if (tree[inc].id === taskId) {
                        tree[inc].isComplete = isComplete;
                        arrayJsonItems.push(tree[inc]);
                    }
                    if (tree[inc].parentId === taskId && !tree[inc].isComplete) {
                        tree[inc].items.map((item) => {
                            if (item.parentId === tree[inc].id) {
                                item.isComplete = isComplete;
                                arrayJsonItems.push(item);
                            }
                            recursiveComplete(tree[inc].items, true);
                        });
                        arrayJsonItems.push(tree[inc]);
                        tree[inc].isComplete = isComplete;
                    }
                }

                recursiveComplete(tree[inc].items);
            }
        }

        const setUncompleteRecursive = (tasks: ITodoItem[], taskId: string) => {
            if (!isComplete) {
                const task = findTaskInTree(tasks, taskId);
                if (task && task.parentId) {
                    const taskParent = findTaskInTree(tasks, task.parentId);
                    if (taskParent) {
                        taskParent.isComplete = false;
                        arrayJsonItems.push(taskParent);
                        setUncompleteRecursive(tasks, taskParent.id);
                    }
                }
            }
        }


        recursiveComplete(tasksclones);
        setUncompleteRecursive(tasksclones, taskId);

        setJsonItems(arrayJsonItems, todosItems, "task", false);
        setTodos({ data: tasksclones });
        return tasksclones;
    }

    const reindex = (todoItems: ITodoItem[]) => {
        todoItems.map((item, index) => {
            item.index = index;
        });
    }

    const dragAndDropSort = (destination: DraggableLocation, draggableId: string, dragSection: boolean = false) => {
        let tasks;
        if (dragSection) {
            tasks = sections;
        } else {
            tasks = todos;
        }

        const todosclones = recursiveCloneTree(tasks);
        const droppableTask = findTaskInTree(todosclones, destination.droppableId);
        const draggableTask = findTaskInTree(todosclones, draggableId);

        if (droppableTask && draggableTask && droppableTask.index !== undefined) {
            let pos = 'upper';
            if (destination.index > droppableTask.index) {
                pos = 'lower';
            } else {
                pos = 'upper';
            }
            console.log({droppableTask})
            if (dragSection) {
                console.log('test')
                console.log({position: pos})
               
                createSection({
                    sectionId: droppableTask.id,
                    editFields: draggableTask,
                    sortByPosition: { sortPosition: droppableTask.sort, position: pos },
                    sectionsList: todosclones
                });
            } else {
                if (draggableTask.type === "section") {
                    const sort = (items: ITodoItem[]) => {
                        sortPositions(items, { sortPosition: droppableTask.sort, position: pos });
                    }
                    createTaskSection({ name: draggableTask.name, sort: droppableTask.sort, editFields: draggableTask, sortFunc: sort });
                } else {
                    createTask(droppableTask.id, draggableTask, pos);
                }
            }
        }
    }

    return {
        findTaskInTree,
        recursiveCloneTree,
        mutateTask,
        createTask,
        removeTask,
        mutateAllTasks,
        createTaskSection,
        createSection,
        completeTasks,
        generateTaskId,
        dragAndDropSort
    };
}
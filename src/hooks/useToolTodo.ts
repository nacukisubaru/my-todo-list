import { useState } from "react";
import { useTaskTree } from "./useTaskTree";
import { useAppSelector } from "./useAppSelector";
import { useActions } from "./useActions";
import { todoSectionsApi } from "../store/services/todo/todo-sections.api";
import { todoApi } from "../store/services/todo/todo.api";

type type = "todo" | "section";

export const useToolTodo = (id: string, type: type = "todo") => {
    let todos = useAppSelector((state) => state.todosReducer.todos);
    const { findTaskInTree, mutateTask, mutateAllTasks } = useTaskTree();
    const { setActiveAddTaskBtn } = useActions();
    const [toolPanelIsVisible, setVisibleToolPanel] = useState(false);
    const [updSection] = todoSectionsApi.useUpdateMutation();
    const [updTodo] = todoApi.useUpdateMutation();

    const [todoEditInputs, setTodoEditInputs] = useState({
        name: "",
        text: "",
    });

    const mutateTasks = async (field: string, callback: (obj: any) => void) => {
        await mutateTask(id, [{ field, value: true }]);
        await mutateAllTasks(callback);
        hideToolPanel();
    }

    const openTodoChangePanel = async () => {
        const foundTask = findTaskInTree(
            todos,
            id
        );
        if (foundTask !== false) {
            setTodoEditInputs({
                name: foundTask.name,
                text: foundTask.description,
            });
        
        }

        const callback = (obj: any) => {
            obj.creatable = false;
            if (type === "todo") {
                obj.creatableLower = false;
                obj.creatableUpper = false;
            }

            if (obj.id !== id) {
                obj.editable = false;
            } else {
                obj.editable = true;
            }
        };

        if (type === "todo") {
            setActiveAddTaskBtn({ isActive: true });
        }

        await mutateTasks("editable", callback);
    };

    const showUpperOrLowerForm = async (
        field: string,
        fieldDisable: string
    ) => {
        const callback = (obj: any) => {
            obj.creatable = false;
            obj[fieldDisable] = false;
            obj.editable = false;
            if (obj.id !== id) {
                obj[field] = false;
            } else {
                obj[field] = true;
            }
        };

        setActiveAddTaskBtn({ isActive: false });
        await mutateTasks("editable", callback);
    };

    const closeTodoChangePanel = () => {
        mutateTask(id, [{ field: "editable", value: false }]);
    };

    const toggleTaskList = async (value: any) => {
        const task = await mutateTask(id, [{ field: "showTasks", value }]);
        if (type === "section") {
            updSection(task);
        } else {
            updTodo(task);
        }
    };

    const showToolPanel = () => {
        setVisibleToolPanel(true);
    };

    const hideToolPanel = () => {
        setVisibleToolPanel(false);
    };

    return { 
        openTodoChangePanel, 
        closeTodoChangePanel, 
        toggleTaskList, 
        showToolPanel, 
        hideToolPanel,
        showUpperOrLowerForm,
        toolPanelIsVisible,
        todoEditInputs 
    };
}
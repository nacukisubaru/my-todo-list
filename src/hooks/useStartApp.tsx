import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getSections } from "../store/services/sections/sections.slice";
import { getTodosBySection, updPositions } from "../store/services/todo/todo.slice";
import { useTaskTree } from "./useTaskTree";
import { useAppSelector } from "./useAppSelector";
import { useActions } from "./useActions";
import { useNavigate, useParams } from "react-router-dom";

export const useStartApp = () => {
    const dispatch = useDispatch();

    let { sections } = useAppSelector((state) => state.sectionsReducer);
    let { todos } = useAppSelector((state) => state.todosReducer);

    const { findTaskInTree } = useTaskTree();
    const { setCurrentSection, setCurrentTodo, setVisibleDetailTodo, setAuth } = useActions();
    const { sectionId, todoId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const get = async () => {
            await dispatch(updPositions());
            const res = await dispatch(getSections());
            if (res.error) {
                navigate('/app/login');
                setAuth({isAuth: false});
            } else {
                setAuth({isAuth: true});
            }
        };
        get();
    }, []);

    useEffect(() => {
        const getTodos = async () => {
            await dispatch(getTodosBySection(sectionId));
        };

        if (sectionId) {
            getTodos();
            if (sections.length) {
                const section = findTaskInTree(sections, sectionId);
                if (section) {
                    setCurrentSection({ section });
                }
            }
        }
    }, [sectionId, sections]);

    useEffect(() => {
        const setTodo = async () => {
            if (todoId) {
                const todo = findTaskInTree(todos, todoId);
                if (todo) {
                    await setCurrentTodo({todo});
                    setVisibleDetailTodo({isActive: true});
                }
            }
        }
        setTodo();
    }, [todoId, todos]);
};

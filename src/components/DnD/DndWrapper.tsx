import { FC } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

interface IDndWrapper {
    id: string,
    index: number,
    children: any
}

const DndWrapper: FC<IDndWrapper> = ({id, index, children}) => {
    return (
        <>
            <Droppable droppableId={id} key={id}>
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        <Draggable
                            key={id}
                            draggableId={id}
                            index={index}
                        >
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    {children}
                                </div>
                            )}
                        </Draggable>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </>
    );
};

export default DndWrapper;

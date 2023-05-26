import { FC, useEffect, useState } from "react";
import { filesFolderApi } from "../../store/services/files/files-folder.api";
import KendoModal from "../../ui/Modal/KendoModal";
import LeftMenu from "../../ui/LeftMenu/LeftMenu";
import { filesApi } from "../../store/services/files/files.api";
import ImageCard from "../../ui/Cards/ImageCard";
import { useActions } from "../../hooks/useActions";
import BasicButton from "../../ui/Buttons/BasicButton/BasicButton";

interface IUploadedImagesSelect {
    show?: boolean;
    onClose: () => void;
    callbackSelectFile?: (file: string) => void;
}

const UploadedImagesSelect: FC<IUploadedImagesSelect> = ({
    show = false,
    onClose,
    callbackSelectFile
}) => {
    const [folderId, setFolderId] = useState(0);
    const {
        data = [],
        status,
    } = filesFolderApi.useGetFoldersByUserQuery("");
     const files = filesApi.useGetFilesByFolderQuery(folderId);

    const [selectedFile, setSelectedFile] = useState('');

    const setSelectedFolderId = (id: number) => {
        setFolderId(id);
    };

    useEffect(() => {
        files.refetch();
    }, [folderId]);

    const selectFile = () => {
        callbackSelectFile && callbackSelectFile(selectedFile);
        onClose && onClose();
    }

    const setFile = (file: string) => {
        setSelectedFile(file)
    }

    return (
        <>
            {status === "fulfilled" && (
                <KendoModal
                    initialWidth={1200}
                    initialHeight={600}
                    isVisible={show}
                    onClose={onClose}
                >
                    <div>
                        <div className="display flex">
                            <div className="mr-[165px]">
                                <LeftMenu
                                    items={data}
                                    itemClick={setSelectedFolderId}
                                ></LeftMenu>
                            </div>
                            {files.data && files.data.map((item: any) => {
                                return (
                                    <span onClick={() => {setFile(item.path)}}>
                                        <ImageCard name={item.name} path={item.path} width="w-[250px]"/>
                                    </span>
                                )
                            })}
                        </div>
                        <div className="dispay flex justify-end mt-[49vh]">
                            <BasicButton name="Применить" color="primary" onClick={selectFile}></BasicButton>
                        </div>
                    </div>
                </KendoModal>
            )}
        </>
    );
};

export default UploadedImagesSelect;

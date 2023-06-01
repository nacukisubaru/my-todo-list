import { FC, useEffect, useState } from "react";
import { filesFolderApi } from "../../store/services/files/files-folder.api";
import KendoModal from "../../ui/Modal/KendoModal";
import LeftMenu from "../../ui/LeftMenu/LeftMenu";
import { filesApi } from "../../store/services/files/files.api";
import ImageCard from "../../ui/Cards/ImageCard";
import BasicButton from "../../ui/Buttons/BasicButton/BasicButton";
import Modal from "../../ui/Modal/Modal";

interface IUploadedImagesSelect {
    show?: boolean;
    onClose: () => void;
    callbackSelectFile?: (file: string) => void;
}

interface IFolderState {
    id: number;
    name: string;
}

const UploadedImagesSelect: FC<IUploadedImagesSelect> = ({
    show = false,
    onClose,
    callbackSelectFile,
}) => {
    const [folder, setFolder] = useState<IFolderState>({
        id: 0,
        name: "",
    });
    const { data = [], status } = filesFolderApi.useGetFoldersByUserQuery("");
    const files = filesApi.useGetFilesByFolderQuery(folder.id, {
        skip: folder.id === 0 ? true : false,
    });

    const [createFolder] = filesFolderApi.useCreateFolderMutation();
    const [removeFile] = filesApi.useRemoveFileMutation();
    const [deleteFolder] = filesFolderApi.useRemoveFolderMutation();

    const [upload] = filesApi.useUploadFilesMutation();
    const [selectedFile, setSelectedFile] = useState("");
    const [folderName, setFolderName] = useState("");
    const [isVisibleFolderModal, showAddFolderModal] = useState(false);

    const setSelectedFolderId = (item: any) => {
        setFolder(item);
    };

    useEffect(() => {
        if (folder.id) {
            files.refetch();
        }
    }, [folder]);

    const selectFile = () => {
        callbackSelectFile && callbackSelectFile(selectedFile);
        onClose && onClose();
    };

    const setFile = (file: string) => {
        setSelectedFile(file);
    };

    const uploadImage = (e: any) => {
        const files = e.target.files[0];
        const folderId: any = folder.id;
        if (files) {
            const formData = new FormData();
            formData.append("image", files);
            formData.append("folderId", folderId);
            formData.append("folderName", folder.name);
            upload(formData);
        }
    };

    const addFolder = () => {
        createFolder({ name: folderName });
        setFolderName('');
        showAddFolderModal(false);
    };

    const openAddFolderModal = () => {
        showAddFolderModal(true);
    };

    const closeAddFolderModal = () => {
        showAddFolderModal(false);
    };

    const deleteFile = (fileId: number) => {
        removeFile(fileId);
    }
    
    const removeFolder = (folder: any) => {
        if (folder.name !== 'upload') {
            setFolder({id: 0, name: ''});
            deleteFolder(folder.id);
        }
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
                    <Modal
                        modalSettings={{
                            title: "Добавить папку",
                            primaryBtnName: "Добавить",
                            secondaryBtnName: "Отмена",
                            isVisible: isVisibleFolderModal,
                        }}
                        callbacks={{
                            primaryBtnClick: addFolder,
                            secondaryBtnClick: closeAddFolderModal,
                        }}
                    >
                        <div>
                            <input
                                type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                onChange={(e) => {
                                    setFolderName(e.target.value);
                                }}
                                value={folderName}
                            />
                        </div>
                    </Modal>
                    <div>
                        <div className="display flex">
                            <div className="mr-[35px]">
                                <div className="mb-[8px]">
                                    <LeftMenu
                                        menuItems={[{name: 'Удалить папку', onClick: (item) => {removeFolder(item)}}]}
                                        items={data}
                                        itemClick={setSelectedFolderId}
                                    ></LeftMenu>
                                </div>
                                <BasicButton
                                    name="Создать папку"
                                    color="secondary"
                                    onClick={openAddFolderModal}
                                />
                            </div>
                            <div>
                                <div
                                    className="mb-[45px] display grid gap-[1rem] overflow-scroll h-[42vh] w-[96vh]"
                                    style={{
                                        gridTemplateColumns:
                                            "repeat(3, 1fr)",
                                    }}
                                >
                                    {files.data && folder.id > 0 &&
                                        files.data.map((item: any) => {
                                            return (
                                                <span
                                                    className="ml-[15px]"
                                                    onClick={() => {
                                                        setFile(item.path);
                                                    }}
                                                >
                                                    <ImageCard
                                                        name={item.originalName}
                                                        path={item.path}
                                                        width="w-[250px]"
                                                        cardColor={
                                                            item.path ===
                                                            selectedFile
                                                                ? "bg-red-400"
                                                                : ""
                                                        }
                                                        removeFile={() => {deleteFile(item.id)}}
                                                    />
                                                </span>
                                            );
                                        })}
                                </div>

                                <input type="file" onChange={uploadImage} />
                            </div>
                        </div>
                        {files.data && files.data.length > 0 && (
                            <div className="dispay flex justify-end">
                                <span className="ml-[5px]">
                                    <BasicButton
                                        name="Применить"
                                        color="primary"
                                        onClick={selectFile}
                                    ></BasicButton>
                                </span>
                            </div>
                        )}
                    </div>
                </KendoModal>
            )}
        </>
    );
};

export default UploadedImagesSelect;

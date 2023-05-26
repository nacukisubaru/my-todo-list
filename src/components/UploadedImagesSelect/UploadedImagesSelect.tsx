import { FC, useEffect, useState } from "react";
import { filesFolderApi } from "../../store/services/files/files-folder.api";
import KendoModal from "../../ui/Modal/KendoModal";
import LeftMenu from "../../ui/LeftMenu/LeftMenu";
import { filesApi } from "../../store/services/files/files.api";
import ImageCard from "../../ui/Cards/ImageCard";
import BasicButton from "../../ui/Buttons/BasicButton/BasicButton";

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
    const [upload] = filesApi.useUploadFilesMutation();

    const [selectedFile, setSelectedFile] = useState("");

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
                            <div>
                                {files.data && files.data.length > 0 &&(
                                    <>
                                        <div
                                            className="mb-[45px] display grid gap-[1rem] overflow-scroll h-[62vh]"
                                            style={{
                                                gridTemplateColumns:
                                                    "repeat(3, 1fr)",
                                            }}
                                        >
                                            {files.data.map((item: any) => {
                                                return (
                                                    <span
                                                        className="ml-[15px]"
                                                        onClick={() => {
                                                            setFile(item.path);
                                                        }}
                                                    >
                                                        <ImageCard
                                                            name={item.name}
                                                            path={item.path}
                                                            width="w-[250px]"
                                                            cardColor={ item.path === selectedFile ? "bg-red-400" : "" }
                                                        />
                                                    </span>
                                                );
                                            })}
                                        </div>

                                        <input
                                            type="file"
                                            onChange={uploadImage}
                                        />
                                    </>
                                )}
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

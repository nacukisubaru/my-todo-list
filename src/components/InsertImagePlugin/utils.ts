import { EditorUtils } from "@progress/kendo-react-editor";

export const insertImageFiles = (props: any) => {
  const {
    view,
    files,
    nodeType,
    position,
    attrs = {},
  } = props;
  
  if (EditorUtils.canInsert(view.state, nodeType)) {
    files.forEach((file: any) => {
      let reader = new FileReader();
      reader.onload = function (e: any) {
        const image = nodeType.createAndFill({
          ...attrs,
          src: e.target.result,
        });
        if (position) {
          view.dispatch(view.state.tr.insert(position.pos, image));
        } else {
          EditorUtils.insertNode(view, image, true);
        }
      };
      reader.readAsDataURL(file);
    });
  }
};
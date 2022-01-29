import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  TextField,
  FormControl,
  FormHelperText,
  LinearProgress,
} from "@material-ui/core";
import { CheckCircle, Close } from "@material-ui/icons";
import { DropzoneArea } from "material-ui-dropzone";

import { GlobalStateContext } from "../../context/GlobalStateContext";
import { Loading } from "../../components/MainbarComponent";
import { uploadImage } from "../../apiClient";

const ImagePreview = ({ topicId, addNode, setHasChanges }) => {
  const { showToast } = useContext(GlobalStateContext);
  const [uploadProgess, setUploadProgess] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [imageState, setImageState] = useState(null);
  const descInput = useRef(null);

  const resetPreview = () => {
    setImageState(null);
    setUploadProgess(null);
    setThumbnail(null);
    setHasChanges(false);
  };

  useEffect(() => {
    setHasChanges(imageState !== null);
  }, [imageState]);

  const onImageAdded = (files) => {
    if (!files[0]) {
      return;
    }
    setImageState(files[0]);
    var reader = new FileReader();

    reader.onload = (e) => {
      setThumbnail(e.target.result);
    };

    reader.readAsDataURL(files[0]);
  };

  return (
    <>
      <div className="mainbar-content">
        {imageState !== null ? (
          thumbnail === null ? (
            <Loading message="Loading preview" />
          ) : (
            <>
              <img
                src={thumbnail}
                style={{
                  height: "40%",
                  width: "100%",
                  objectFit: "scale-down",
                }}
              />
              <div className="container">
                <div className="content">
                  <TextField
                    label="Description (optional)"
                    variant="outlined"
                    disabled={uploadProgess !== null}
                    inputRef={(inp) => (descInput.current = inp)}
                    className="modal-input"
                  />
                  {uploadProgess !== null && uploadProgess >= 0 ? (
                    <LinearProgress
                      color="primary"
                      value={uploadProgess}
                      variant="determinate"
                      className="modal-input"
                    />
                  ) : (
                    <>
                      <Button
                        color="primary"
                        startIcon={<Close />}
                        variant="outlined"
                        style={{ marginRight: "16px" }}
                        onClick={resetPreview}
                      >
                        Cancel
                      </Button>
                      <Button
                        color="primary"
                        startIcon={<CheckCircle />}
                        variant="contained"
                        onClick={() => {
                          const description = descInput.current.value.trim();
                          // return console.log(topicId);
                          uploadImage(imageState, topicId, (progress) =>
                            setUploadProgess(progress)
                          ).then((fileName) => {
                            const node = {
                              value: fileName,
                            };
                            if (description) {
                              node.description = description;
                            }
                            addNode(node).then(resetPreview);
                          });
                        }}
                      >
                        Add Image
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </>
          )
        ) : (
          <FormControl className="modal-input">
            <DropzoneArea
              acceptedFiles={["image/*"]}
              filesLimit={1}
              onChange={onImageAdded}
              showPreviewsInDropzone={false}
            />
            <FormHelperText>
              Drag and Drop / Click to upload a single image file.
            </FormHelperText>
            <FormHelperText>
              File size should be less than <b>2MB</b>.
            </FormHelperText>
          </FormControl>
        )}
      </div>
    </>
  );
};

export default ImagePreview;

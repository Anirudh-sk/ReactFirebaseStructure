import React, { useContext, useState, useRef } from "react";
import {
  Button,
  TextField,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import { CheckCircle } from "@material-ui/icons";

import { GlobalStateContext } from "../../context/GlobalStateContext";
import { Loading } from "../../components/MainbarComponent";

const ParagraphPreview = ({ addNode }) => {
  const { showToast } = useContext(GlobalStateContext);
  const [isAPILoading, setLoadingAPI] = useState(false);
  const headingInput = useRef(null);
  const contentInput = useRef(null);

  return (
    <>
      <div className="mainbar-content">
        <FormControl className="modal-input">
          <TextField
            label="Heading (optional)"
            variant="outlined"
            className="modal-input"
            inputRef={(inp) => (headingInput.current = inp)}
          />
          <TextField
            label="Type here..."
            multiline
            autoFocus
            inputProps={{ style: { minHeight: "20vh", maxHeight: "56vh" } }}
            variant="outlined"
            inputRef={(inp) => (contentInput.current = inp)}
            className="modal-input"
          />
          <FormHelperText style={{ marginBottom: "16px" }}>
            Suggestion: Content should be less than 500 words.
          </FormHelperText>

          {!isAPILoading ? (
            <Button
              color="primary"
              startIcon={<CheckCircle />}
              variant="contained"
              onClick={() => {
                setLoadingAPI(true);
                const heading = headingInput.current.value.trim();
                const content = contentInput.current.value.trim();
                const node = {};
                if (heading) {
                  node.heading = heading;
                }
                node.value = content;
                addNode(node).then(() => {
                  headingInput.current.value = "";
                  contentInput.current.value = "";
                  setLoadingAPI(false);
                });
              }}
            >
              Add Content
            </Button>
          ) : (
            <Loading message="Adding content..." />
          )}
        </FormControl>
      </div>
    </>
  );
};

export default ParagraphPreview;

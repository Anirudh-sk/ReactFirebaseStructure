import React, { useState, useContext, useRef } from "react";
import {
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  TextField,
  DialogTitle,
} from "@material-ui/core";

import { GlobalStateContext } from "../context/GlobalStateContext";
import { Loading } from "./MainbarComponent";

const EditTextDialog = ({
  visible,
  closeThis,
  dialogTitle,
  loaderMessage,
  inputLabel,
  createCallback,
  defaultValue,
  buttonTitle,
}) => {
  const [requestingAPI, setRequestingAPI] = useState(false);
  const { showToast } = useContext(GlobalStateContext);
  const inputTitleRef = useRef(null);

  return (
    <>
      <Dialog open={visible} maxWidth="sm" fullWidth>
        <DialogTitle>{dialogTitle || "Untitled"}</DialogTitle>
        <DialogContent>
          {requestingAPI && <Loading message={loaderMessage} />}
          <div hidden={requestingAPI}>
            <TextField
              label={inputLabel}
              autoFocus
              variant="outlined"
              defaultValue={defaultValue || ""}
              inputRef={(inp) => (inputTitleRef.current = inp)}
              className="modal-input"
            />
          </div>
        </DialogContent>
        <DialogActions style={requestingAPI ? { display: "none" } : {}}>
          <Button onClick={closeThis} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              const title = inputTitleRef.current.value.trim();

              setRequestingAPI(true);
              createCallback(title)
                .then(closeThis)
                .catch((err) => showToast(err))
                .finally(() => setRequestingAPI(false));
            }}
            color="primary"
          >
            {buttonTitle || `Create`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default EditTextDialog;

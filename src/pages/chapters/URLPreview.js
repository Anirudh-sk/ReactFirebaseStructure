import React, { useContext, useState } from "react";
import {
  Button,
  TextField,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import { CheckCircle, Close } from "@material-ui/icons";

import { GlobalStateContext } from "../../context/GlobalStateContext";
import { Loading } from "../../components/MainbarComponent";
import { verifyVideo } from "../../apiClient";

const URLPreview = ({ addNode }) => {
  const { showToast } = useContext(GlobalStateContext);

  return (
    <>
      <div className="mainbar-content">
        <FormControl className="modal-input">
          <TextField
            label="URL"
            variant="outlined"
            autoFocus
            className="modal-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const url = e.target.value.trim();
                e.target.disabled = true;
                addNode({ value: url })
                  .then(() => {
                    e.target.value = "";
                    showToast("Added successfully.");
                  })
                  .catch((err) => {
                    showToast("Something went wrong.");
                  })
                  .finally(() => {
                    e.target.disabled = false;
                  });
              }
            }}
          />
          <FormHelperText>
            Eg. Type{" "}
            <b>https://en.wikipedia.org/wiki/Lists_of_mathematics_topics</b>
          </FormHelperText>
          <FormHelperText>and press Enter to add.</FormHelperText>
        </FormControl>
      </div>
    </>
  );
};

export default URLPreview;

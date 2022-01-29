import React, { useState, useContext, useRef, useEffect } from "react";
import {
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

import { GlobalStateContext } from "../../context/GlobalStateContext";
import { Loading } from "../../components/MainbarComponent";

const UpdateChaptersDialog = ({ closeThis, semesterId }) => {
  const [requestingAPI, setRequestingAPI] = useState(false);
  const { showToast, getSemester, updateSemester, chapters } = useContext(
    GlobalStateContext
  );
  const semester = getSemester(semesterId);
  const selectedChaptersRef = useRef([]);

  useEffect(() => {
    selectedChaptersRef.current =
      semester && semester.units ? [...semester.units] : [];
  }, [semester]);

  const onSelectChapter = (e) => {
    if (e.currentTarget.checked) {
      selectedChaptersRef.current.push(e.currentTarget.value);
    } else {
      selectedChaptersRef.current = selectedChaptersRef.current.filter(
        (id) => id !== e.currentTarget.value
      );
    }
    console.log(selectedChaptersRef.current);
  };

  if (!semester) {
    return null;
  }

  return (
    <>
      <Dialog open={!!semesterId} maxWidth="sm" fullWidth>
        <DialogTitle>{semester.name}</DialogTitle>
        <DialogContent>
          {requestingAPI && <Loading message="Updating Chapters..." />}
          <div hidden={requestingAPI}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Assign chapters</FormLabel>
              <FormGroup>
                {chapters.value.map((c) => (
                  <FormControlLabel
                    key={c.id}
                    control={
                      <Checkbox
                        name={c.name}
                        onChange={onSelectChapter}
                        value={c.id}
                        defaultChecked={semester.units.includes(c.id)}
                      />
                    }
                    label={c.name}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions style={requestingAPI ? { display: "none" } : {}}>
          <Button onClick={closeThis} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              const selectedChapters = selectedChaptersRef.current;

              setRequestingAPI(true);
              updateSemester({ ...semester, units: selectedChapters })
                .then(closeThis)
                .catch((err) => showToast(err))
                .finally(() => setRequestingAPI(false));
            }}
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default UpdateChaptersDialog;

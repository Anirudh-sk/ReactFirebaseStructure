import React, { useContext, useState } from "react";
import FlatList from "flatlist-react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { Add, School } from "@material-ui/icons";

import { GlobalStateContext } from "../../context/GlobalStateContext";
import EditTextDialog from "../../components/EditTextDialog";
import {
  MainbarErrorMessage,
  Loading,
} from "../../components/MainbarComponent";
import UpdateChaptersDialog from "./UpdateChaptersDialog";

const Semester = () => {
  const {
    classes,
    semesters,
    updateSemester,
    addSemester,
    showToast,
  } = useContext(GlobalStateContext);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateChaptersFor, setUpdateChaptersFor] = useState(null);
  const [editSemester, setEditSemester] = useState(null);

  return (
    <>
      <EditTextDialog
        visible={createDialogOpen}
        closeThis={() => setCreateDialogOpen(false)}
        createCallback={(title) => {
          return addSemester(title)
            .then(() => {
              setCreateDialogOpen(false);
            })
            .catch((err) => {
              showToast(err);
            });
        }}
        dialogTitle="New Semester"
        inputLabel="Semester Name"
        loaderMessage="Creating new semester..."
      />

      <EditTextDialog
        visible={!!editSemester}
        closeThis={() => setEditSemester(null)}
        createCallback={(title) => {
          return updateSemester({ ...editSemester, name: title }).then(() => {
            setEditSemester(null);
          });
        }}
        defaultValue={editSemester ? editSemester.name : ""}
        dialogTitle="Edit Semester"
        buttonTitle="Update"
        inputLabel="Semester Name"
        loaderMessage="Updating..."
      />

      <UpdateChaptersDialog
        semesterId={updateChaptersFor}
        closeThis={() => setUpdateChaptersFor(null)}
      />

      <AppBar position="relative" className="app-bar">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Semester
          </Typography>
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => setCreateDialogOpen(true)}
            startIcon={<Add />}
            size="small"
          >
            Add Semester
          </Button>
        </Toolbar>
      </AppBar>
      <div className="mainbar-content">
        {semesters.isLoading ? (
          <Loading message="Loading semesters" />
        ) : semesters.error ? (
          <MainbarErrorMessage message="No semesters found." />
        ) : (
          <FlatList
            list={semesters.value}
            renderItem={(s) => {
              return (
                <SemesterCard
                  rename={() => setEditSemester(s)}
                  updateChapters={() => setUpdateChaptersFor(s.id)}
                  key={s.id}
                  semester={s}
                />
              );
            }}
            sortBy="name"
          />
        )}
      </div>
    </>
  );
};

const SemesterCard = ({ semester, rename, updateChapters }) => {
  return (
    <div className="message-container">
      <div className="message-icon">
        <School color="primary" />
      </div>
      <div className="message-body">
        <div className="posted-by">{semester.name}</div>
        <div className="message">{`${
          semester.units ? semester.units.length : "No"
        } chapter(s)`}</div>
        <div className="message-action">
          <Button variant="outlined" onClick={rename}>
            Rename
          </Button>
          <Button variant="outlined" onClick={updateChapters}>
            Edit Chapters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Semester;

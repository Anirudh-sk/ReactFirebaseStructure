import React, { useContext, useEffect, useState } from "react";
import FlatList from "flatlist-react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { Add, Description, CheckCircle } from "@material-ui/icons";

import { GlobalStateContext } from "../../context/GlobalStateContext";
import { dummyRequest } from "../../apiClient";
import EditTextDialog from "../../components/EditTextDialog";
import {
  Loading,
  MainbarErrorMessage,
} from "../../components/MainbarComponent";

const Chapter = ({ history }) => {
  const { classes, chapters, addChapter } = useContext(GlobalStateContext);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <>
      <EditTextDialog
        visible={createDialogOpen}
        closeThis={() => setCreateDialogOpen(false)}
        createCallback={(title) => addChapter(title)}
        dialogTitle="New Chapter"
        inputLabel="Chapter Name"
        loaderMessage="Creating new chapter..."
      />
      <AppBar position="relative" className="app-bar">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Chapters
          </Typography>
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => setCreateDialogOpen(true)}
            startIcon={<Add />}
            size="small"
          >
            New Chapter
          </Button>
        </Toolbar>
      </AppBar>
      <div className="mainbar-content">
        {chapters.isLoading ? (
          <Loading message="Loading chapters" />
        ) : chapters.error ? (
          <MainbarErrorMessage message="No chapters found." />
        ) : (
          <FlatList
            list={chapters.value}
            renderItem={(c) => {
              return (
                <ChapterCard
                  key={c.id}
                  chapter={c}
                  onClick={() => history.push(`/tool/chapters/${c.id}/topics`)}
                />
              );
            }}
            sortBy="name"
            groupBy={(g) => `${g.published ? "Published" : "Not Published"}`}
            groupSeparator={(group, idx, groupLabel) => (
              <div
                className={
                  "post-category " +
                  (groupLabel === "Published" ? "" : "not-published")
                }
              >
                {groupLabel}
              </div>
            )}
          />
        )}
      </div>
    </>
  );
};

export const ChapterCard = ({ chapter, onClick }) => {
  return (
    <div className="message-container" onClick={onClick}>
      <div className="message-icon">
        {chapter.published ? (
          <CheckCircle color="primary" />
        ) : (
          <Description color="secondary" />
        )}
      </div>
      <div className="message-body">
        <div className="posted-by">{chapter.name}</div>
        <div className="message">{`${
          chapter.topics.length > 0 ? chapter.topics.length : "No"
        } topic(s)`}</div>
      </div>
      {/* <div className="italic">{new Date().toDateString()}</div> */}
    </div>
  );
};

export default Chapter;

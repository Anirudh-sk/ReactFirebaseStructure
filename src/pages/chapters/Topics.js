import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Paper,
} from "@material-ui/core";
import ReactDragListView from "react-drag-listview";
import { Edit, Send, Add, Save, Undo } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

import { GlobalStateContext } from "../../context/GlobalStateContext";
import EditTextDialog from "../../components/EditTextDialog";
import {
  Loading,
  MainbarErrorMessage,
} from "../../components/MainbarComponent";

const Topics = ({ location }) => {
  const { classes, chapters, getChapter, updateChapter, addTopic } = useContext(
    GlobalStateContext
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [topicList, setTopicList] = useState([]);
  const [dragged, setDragged] = useState(false);
  const id = location.pathname.split("/")[3];

  useEffect(() => {
    if (!chapters.isLoading && !chapters.error) {
      const chapter = getChapter(id);
      if (chapter) {
        setTopicList(chapter.topics.sort((a, b) => a.position - b.position));
        setCurrentChapter(chapter);
      }
    }
  }, [chapters]);

  const saveDragChanges = () => {
    updateChapter({
      ...currentChapter,
      topics: topicList.map((t, index) => ({ ...t, position: index })),
    });
    setDragged(false);
  };

  const discardChanges = () => {
    setTopicList(currentChapter.topics.sort((a, b) => a.position - b.position));
    setDragged(false);
  };

  const togglePublishChapter = () => {
    updateChapter({ ...currentChapter, published: !currentChapter.published });
  };

  if (chapters.isLoading) {
    return (
      <div className="mainbar-content">
        <Loading message="Loading topics..." />
      </div>
    );
  } else if (chapters.error || !currentChapter) {
    return (
      <div className="mainbar-content">
        <MainbarErrorMessage message="Something went wrong. Try again later." />
      </div>
    );
  }

  return (
    <>
      <EditTextDialog
        visible={createDialogOpen}
        closeThis={() => setCreateDialogOpen(false)}
        createCallback={(title) => addTopic(currentChapter, title)}
        dialogTitle="New Topic"
        inputLabel="Topic Name"
        loaderMessage="Creating new topic..."
      />
      <EditTextDialog
        visible={renameDialogOpen}
        closeThis={() => setRenameDialogOpen(false)}
        defaultValue={currentChapter.name}
        buttonTitle="Rename"
        createCallback={(title) =>
          updateChapter({ ...currentChapter, name: title })
        }
        dialogTitle="Reanme Chapter"
        inputLabel="Chapter Name"
        loaderMessage="Renaming..."
      />
      <AppBar position="relative" className="app-bar">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {currentChapter.name}
          </Typography>
          <Button
            startIcon={<Add />}
            style={dragged ? { display: "none" } : {}}
            variant="outlined"
            onClick={() => setCreateDialogOpen(true)}
          >
            Add Topic
          </Button>
        </Toolbar>
      </AppBar>

      <div className="mainbar-content topic-box">
        <div className="topic-container">
          <div className="mainbar-content child">
            <ReactDragListView
              onDragEnd={(fromIndex, toIndex) => {
                const data = [...topicList];
                const item = data.splice(fromIndex, 1)[0];
                data.splice(toIndex, 0, item);
                setTopicList(data);
                setDragged(true);
              }}
              handleSelector="div.message-icon"
              nodeSelector="div.message-container"
            >
              {topicList.map((c, ind) => (
                <TopicCard key={c.id} index={Number(ind) + 1} topic={c} />
              ))}
            </ReactDragListView>
          </div>
        </div>

        <Paper variant="outlined" className="chapter-settings">
          <div className="container">
            <div className="content" style={{ margin: "0 16px 0 16px" }}>
              {dragged ? (
                <>
                  <Button
                    color="primary"
                    className="modal-input"
                    startIcon={<Save />}
                    variant="contained"
                    onClick={saveDragChanges}
                  >
                    Save Changes
                  </Button>
                  <Button
                    color="primary"
                    className="modal-input"
                    startIcon={<Undo />}
                    variant="outlined"
                    onClick={discardChanges}
                  >
                    Discard Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="primary"
                    className="modal-input"
                    startIcon={<Edit />}
                    variant="outlined"
                    onClick={() => setRenameDialogOpen(true)}
                  >
                    Rename
                  </Button>
                  <Button
                    color={currentChapter.published ? "secondary" : "primary"}
                    className="modal-input"
                    startIcon={<Send />}
                    variant="contained"
                    onClick={togglePublishChapter}
                  >
                    {currentChapter.published ? `Unpublish` : `Publish`}
                  </Button>
                </>
              )}
            </div>
          </div>
        </Paper>
      </div>
    </>
  );
};

export const TopicCard = ({ topic, index }) => {
  const history = useHistory();
  return (
    <div
      className="message-container"
      onClick={() => {
        const chapterId = history.location.pathname.split("/")[3];
        history.push(`/tool/chapters/${chapterId}/view-topic/${topic.id}`);
      }}
    >
      <div className="message-icon">
        <Avatar>{index}</Avatar>
      </div>
      <div className="message-body">
        <div className="posted-by">{topic.name}</div>
      </div>
    </div>
  );
};

export default Topics;

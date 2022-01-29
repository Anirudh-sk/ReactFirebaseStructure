import React, { useContext, useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Paper } from "@material-ui/core";
import { Edit, Save, Undo } from "@material-ui/icons";

import { GlobalStateContext } from "../../context/GlobalStateContext";
import {
  addNode as addNodeToAPI,
  loadTopicNodes,
  deleteNode as deleteNodeToAPI,
  TOPIC_TYPE,
  deleteImage,
  updateTopic,
  MAX_TYPE,
} from "../../apiClient";
import EditTextDialog from "../../components/EditTextDialog";
import {
  Loading,
  MainbarErrorMessage,
} from "../../components/MainbarComponent";
import YouTubePreview from "./YouTubePreview";
import ImagePreview from "./ImagePreview";
import ParagraphPreview from "./ParagraphPreview";
import PhonePreview from "./PhonePreview";
import ReArrangePreview from "./ReArrangePreview";
import URLPreview from "./URLPreview";

const REARRANGE_MODE = MAX_TYPE + 1;

const EditTopic = ({ location }) => {
  const {
    classes,
    chapters,
    getChapter,
    showToast,
    renameTopicInChapter,
  } = useContext(GlobalStateContext);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [activeEnteringContent, setActiveEnteringContent] = useState(null);
  const [dragNodeList, setDragNodeList] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [nodeList, setNodeList] = useState(null);
  const [deleteImageList, setDeleteImageList] = useState([]);
  const chapterId = location.pathname.split("/")[3];
  const topicId = location.pathname.split("/")[5];

  useEffect(() => {
    if (!chapters.isLoading && !chapters.error) {
      const chapter = getChapter(chapterId);
      const topic = chapter.topics.find((t) => t.id === topicId);
      if (topic) {
        setCurrentTopic(topic);
      }
    }
  }, [chapters]);

  useEffect(() => {
    if (currentTopic) {
      // load nodes list
      loadTopicNodes(topicId).then((nodes) => {
        setNodeList(nodes.sort((a, b) => a.position - b.position));
      });
    }
  }, [currentTopic]);

  useEffect(() => {
    if (activeEnteringContent === REARRANGE_MODE) {
      setDragNodeList(nodeList);
    }
  }, [activeEnteringContent, nodeList]);

  const saveDragChanges = () => {
    const updatedNodes = [
      ...dragNodeList.map((d, ind) => ({ ...d, position: ind })),
    ];
    updateTopic(topicId, updatedNodes).then(() => {
      // deleteImageList - delete images from cloud storage
      deleteImageList.map((img) => deleteImage(img, topicId));
      setNodeList(updatedNodes);
      setDeleteImageList([]);
      setHasChanges(false);
      showToast("Saved successfully.");
    });
  };

  const discardChanges = () => {
    setDragNodeList([...nodeList]);
    setDeleteImageList([]);
    setHasChanges(false);
  };

  const addNode = (node) => {
    const newNode = {
      ...node,
      position: nodeList.length,
      type: activeEnteringContent,
    };
    return addNodeToAPI(topicId, newNode).then(() =>
      setNodeList((prev) => [...prev, newNode])
    );
  };

  const deleteNode = (node) => {
    return deleteNodeToAPI(topicId, node);
  };

  if (chapters.isLoading) {
    return (
      <div className="mainbar-content">
        <Loading message="Loading topics..." />
      </div>
    );
  } else if (chapters.error || !currentTopic) {
    return (
      <div className="mainbar-content">
        <MainbarErrorMessage message="Something went wrong. Try again later." />
      </div>
    );
  }

  return (
    <>
      <EditTextDialog
        visible={renameDialogOpen}
        closeThis={() => setRenameDialogOpen(false)}
        defaultValue={currentTopic.name}
        buttonTitle="Rename"
        createCallback={(title) =>
          renameTopicInChapter(title, topicId, chapterId).then(() => {
            // setCurrentTopic({ ...currentTopic, name: title });
          })
        }
        dialogTitle="Rename Topic"
        inputLabel="Topic Name"
        loaderMessage="Renaming..."
      />
      <AppBar position="relative" className="app-bar">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {currentTopic.name}
          </Typography>
          <Button
            startIcon={<Edit />}
            variant="outlined"
            onClick={() => setRenameDialogOpen(true)}
          >
            Rename
          </Button>
        </Toolbar>
      </AppBar>

      <div className="mainbar-content topic-box">
        <Paper variant="outlined" className="content-items">
          <div className="container" style={{ flexDirection: "column" }}>
            {["Text", "Image", "YouTube", "URL", "Re-Arrange"].map(
              (name, index) => (
                <TopicContentCard
                  name={name}
                  key={name}
                  isActive={index === activeEnteringContent}
                  onClick={() =>
                    !hasChanges
                      ? setActiveEnteringContent(index)
                      : showToast("Please save/dicard the changes.")
                  }
                />
              )
            )}
          </div>
        </Paper>
        <div className="topic-container">
          <div
            style={{
              margin: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
            }}
          >
            {activeEnteringContent !== null ? (
              activeEnteringContent === TOPIC_TYPE.CONTENT ? (
                <ParagraphPreview addNode={addNode} />
              ) : activeEnteringContent === TOPIC_TYPE.IMAGE ? (
                <ImagePreview
                  addNode={addNode}
                  topicId={topicId}
                  setHasChanges={(hasChange) => setHasChanges(hasChange)}
                />
              ) : activeEnteringContent === TOPIC_TYPE.VIDEO ? (
                <YouTubePreview addNode={addNode} />
              ) : activeEnteringContent === TOPIC_TYPE.URL ? (
                <URLPreview addNode={addNode} />
              ) : activeEnteringContent === REARRANGE_MODE ? (
                <ReArrangePreview
                  nodeList={dragNodeList || []}
                  onListDrag={(fromIndex, toIndex) => {
                    const data = [...dragNodeList];
                    const item = data.splice(fromIndex, 1)[0];
                    data.splice(toIndex, 0, item);
                    setDragNodeList(data);
                    setHasChanges(true);
                  }}
                  setDeleteImageList={(cb) => setDeleteImageList(cb)}
                  deleteNode={(position) => {
                    const data = [
                      ...dragNodeList.filter((n) => n.position !== position),
                    ];
                    setDragNodeList(data);
                    setHasChanges(true);
                  }}
                  topicId={topicId}
                  addNode={addNode}
                />
              ) : null
            ) : null}
          </div>
        </div>

        <Paper
          variant="outlined"
          className={`app-preview ${
            activeEnteringContent === REARRANGE_MODE && "inactive"
          }`}
        >
          <div className="container">
            {activeEnteringContent === REARRANGE_MODE ? (
              <div className="content" style={{ margin: "0 16px 0 16px" }}>
                <Button
                  color="primary"
                  className="modal-input"
                  startIcon={<Save />}
                  variant="contained"
                  disabled={!hasChanges}
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
              </div>
            ) : (
              <div className="mobile-preview">
                <div className="mobile-container">
                  {nodeList === null ? (
                    <Loading />
                  ) : (
                    <PhonePreview nodeList={nodeList} topicId={topicId} />
                  )}
                </div>
              </div>
            )}
          </div>
        </Paper>
      </div>
    </>
  );
};

const TopicContentCard = ({ name, onClick, isActive }) => {
  return (
    <div
      className={`message-container topic-content-type ${isActive && "active"}`}
      onClick={onClick}
    >
      <p>{name}</p>
    </div>
  );
};

export default EditTopic;

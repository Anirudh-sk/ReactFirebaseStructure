import React, { useEffect, useState } from "react";
import ReactDragListView from "react-drag-listview";
import { Avatar } from "@material-ui/core";

import { getImageUrl, TOPIC_TYPE, verifyVideo } from "../../apiClient";
import { Loading } from "../../components/MainbarComponent";
import { Delete } from "@material-ui/icons";

const ReArrangePreview = ({
  nodeList,
  onListDrag,
  setDeleteImageList,
  deleteNode,
  topicId,
}) => {
  return (
    <>
      <ReactDragListView
        onDragEnd={onListDrag}
        handleSelector="div.message-icon"
        nodeSelector="div.message-container"
      >
        {nodeList.map((n, ind) => (
          <NodePreview
            node={n}
            deleteThis={() => {
              if (n.type === TOPIC_TYPE.IMAGE) {
                setDeleteImageList((prev) => [...prev, n.value]);
              }
              deleteNode(n.position);
            }}
            topicId={topicId}
            key={n.position}
          />
        ))}
      </ReactDragListView>
    </>
  );
};

const NodePreview = ({ node, deleteThis, topicId }) => {
  return (
    <div className="message-container">
      <div className="message-icon">
        <Avatar>{`${node.position + 1}`}</Avatar>
      </div>
      <div className="message-body">
        {node.type === TOPIC_TYPE.CONTENT ? (
          <>
            {node.heading && <div className="posted-by">{node.heading}</div>}
            <div className="message">{`${node.value.substr(0, 100)}....`}</div>
          </>
        ) : node.type === TOPIC_TYPE.IMAGE ? (
          <>
            <div className="posted-by">
              <img src={getImageUrl(topicId, node.value)} />
            </div>
            {node.description && (
              <div className="message">{node.description}</div>
            )}
          </>
        ) : node.type === TOPIC_TYPE.VIDEO ? (
          <>
            <div className="posted-by">
              <YtPreviewNode videoId={node.value} />
            </div>
            <div className="message">{`Video => https://www.youtube.com/watch?v=${node.value}`}</div>
          </>
        ) : node.type === TOPIC_TYPE.URL ? (
          <>
            <div className="message">{`URL => ${node.value}`}</div>
          </>
        ) : null}
        <div className="message-action">
          {/* <Edit color="primary" /> */}
          <Delete color="secondary" onClick={deleteThis} />
        </div>
      </div>
    </div>
  );
};

const YtPreviewNode = ({ videoId }) => {
  const [node, setNode] = useState(<Loading />);
  useEffect(() => {
    verifyVideo(videoId)
      .then((res) => res.json())
      .then((res) => setNode(<img src={res.thumbnail_url} />));
  }, []);

  return <>{node}</>;
};

export default ReArrangePreview;

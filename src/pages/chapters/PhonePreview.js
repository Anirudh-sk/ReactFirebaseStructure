import React from "react";

import { getImageUrl, TOPIC_TYPE } from "../../apiClient";

const PhonePreview = ({ nodeList, topicId }) => {
  return (
    <>
      {nodeList.map((n, ind) =>
        n.type === TOPIC_TYPE.VIDEO ? (
          <YouTubeNode key={`${n.position}`} videoId={n.value} />
        ) : n.type === TOPIC_TYPE.IMAGE ? (
          <ImageNode
            key={`${n.position}`}
            url={getImageUrl(topicId, n.value)}
            description={n.description}
          />
        ) : n.type === TOPIC_TYPE.CONTENT ? (
          <ParagraphNode
            key={`${n.position}`}
            content={n.value}
            heading={n.heading}
          />
        ) : n.type === TOPIC_TYPE.URL ? (
          <URLNode key={`${n.position}`} url={n.value} />
        ) : null
      )}
    </>
  );
};

export const YouTubeNode = ({ videoId }) => {
  return (
    <div className="node-container">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        title="video"
        className="yt-player"
      />
    </div>
  );
};

export const ImageNode = ({ url, description }) => {
  return (
    <div className="node-container">
      <div className="image-node">
        <img src={`${url}`} />
        {description && <p className="image-description">{description}</p>}
      </div>
    </div>
  );
};

export const ParagraphNode = ({ content, heading }) => {
  return (
    <div className="node-container">
      <div className="para-node">
        {heading && <p className="para-head">{heading}</p>}
        <p className="para-body">{`${content}`}</p>
      </div>
    </div>
  );
};

export const URLNode = ({ url }) => {
  return (
    <div className="node-container">
      <div className="url-node">
        <p className="url-body">{`${url}`}</p>
      </div>
    </div>
  );
};

export default PhonePreview;

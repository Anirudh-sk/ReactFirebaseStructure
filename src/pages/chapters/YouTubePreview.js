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

const YouTubePreview = ({ addNode }) => {
  const { showToast } = useContext(GlobalStateContext);
  const [validVideoId, setValidVideoId] = useState(null);
  const [videoThumbnail, setVideoThumbnail] = useState(null);

  const resetPreview = () => {
    setValidVideoId(null);
    setVideoThumbnail(null);
  };

  return (
    <>
      <div className="mainbar-content">
        <FormControl className="modal-input">
          <TextField
            label="Video ID"
            variant="outlined"
            autoFocus
            disabled={!!videoThumbnail}
            className="modal-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const videoId = e.target.value.trim();
                setVideoThumbnail("");
                verifyVideo(videoId)
                  .then((res) => res.json())
                  .then((res) => {
                    setValidVideoId(videoId);
                    setVideoThumbnail(res.thumbnail_url);
                  })
                  .catch((err) => {
                    resetPreview();
                    showToast("Not a valid video");
                  });
              }
            }}
          />
          <FormHelperText>
            Eg. https://www.youtube.com/watch?v=g0dqKUR68rU
          </FormHelperText>
          <FormHelperText>
            then type <b>g0dqKUR68rU</b> and press Enter.
          </FormHelperText>
        </FormControl>

        {videoThumbnail !== null ? (
          videoThumbnail === "" ? (
            <Loading message="Verifying video" />
          ) : (
            <>
              <img src={videoThumbnail} />
              <div className="container">
                <div className="content">
                  <Button
                    color="primary"
                    startIcon={<Close />}
                    variant="outlined"
                    style={{ marginRight: "16px" }}
                    onClick={resetPreview}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    startIcon={<CheckCircle />}
                    variant="contained"
                    onClick={() => {
                      addNode({ value: validVideoId.trim() })
                        .then(resetPreview)
                        .catch(() => showToast("Try again later."));
                    }}
                  >
                    Add Video
                  </Button>
                </div>
              </div>
            </>
          )
        ) : null}
      </div>
    </>
  );
};

export default YouTubePreview;

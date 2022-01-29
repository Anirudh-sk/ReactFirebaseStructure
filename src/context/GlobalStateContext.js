import React, {
  createContext,
  useState,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import {
  makeStyles,
  useTheme,
  Snackbar,
  MuiThemeProvider,
  createMuiTheme,
} from "@material-ui/core";
import {
  createChapter,
  updateChapter as updateChapterAPI,
  createSemester,
  dummyRequest,
  listChapters,
  listSemesters,
  updateSemester as updateSemesterAPI,
  createTopic,
  renameTopic as renameTopicInAPI,
} from "../apiClient";

export const GlobalStateContext = createContext();

const drawerWidth = 280;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    color: "#fff",
    backgroundColor: "#fff",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
    backgroundColor: "#312c51",
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    height: "100%",
    backgroundColor: "#312c51",
    color: "#fff",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
}));

const appTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#312c51",
    },
    secondary: {
      main: "#ff0000",
    },
  },
});

const reducer = (state, { type, value }) => {
  if (type === "error") {
    return { ...state, isLoading: false, error: true };
  } else if (type === "value") {
    return { isLoading: false, value, error: false };
  } else if (type === "updateOne") {
    return {
      ...state,
      value: [...state.value.map((v) => (v.id === value.id ? value : v))],
    };
  } else if (type === "addOne") {
    return {
      ...state,
      value: [...state.value, value],
    };
  }
  return state;
};

const initialState = (val) => ({
  isLoading: true,
  value: val,
  error: false,
});

export const GlobalStateContextProvider = ({ children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [toast, showToast] = useState("");
  const [chapters, setChaptersState] = useReducer(reducer, initialState([]));

  const [semesters, setSemestersState] = useReducer(reducer, initialState([]));

  const apiMain = useCallback(() => {
    loadChapters();
    loadSemesters();
  });

  useEffect(apiMain, []);

  const loadSemesters = () => {
    listSemesters()
      .then((value) => {
        setSemestersState({
          type: "value",
          value: value || [],
        });
      })
      .catch((err) => {
        showToast(err);
        setSemestersState({ type: "error" });
      });
  };

  const addSemester = (semesterName) => {
    return createSemester(semesterName).then((id) =>
      setSemestersState({
        type: "addOne",
        value: {
          name: semesterName,
          id: id || `semesterName-${Math.random()}`,
          units: [],
        },
      })
    );
  };

  const updateSemester = (semester) => {
    return updateSemesterAPI(semester)
      .then(() =>
        setSemestersState({
          type: "updateOne",
          value: semester,
        })
      )
      .catch(showToast);
  };

  const loadChapters = () => {
    // dummyRequest(false)
    listChapters()
      .then((value) => {
        setChaptersState({
          type: "value",
          value: value || [],
        });
      })
      .catch((err) => {
        showToast(err);
        setChaptersState({ type: "error" });
      });
  };

  const getChapter = (id) => {
    return chapters.value.find((c) => c.id === id);
  };

  const addChapter = (chapterName) => {
    return createChapter(chapterName).then((id) =>
      setChaptersState({
        type: "addOne",
        value: {
          name: chapterName,
          id,
          topics: [],
          published: false,
        },
      })
    );
  };

  const updateChapter = (chapter) => {
    return updateChapterAPI(chapter)
      .then(() =>
        setChaptersState({
          type: "updateOne",
          value: chapter,
        })
      )
      .catch(showToast);
  };

  const getSemester = (id) => {
    return semesters.value.find((s) => s.id === id);
  };

  const addTopic = (currentChapter, title) => {
    return createTopic(title, currentChapter.topics.length, currentChapter.id)
      .then((id) =>
        updateChapter({
          ...currentChapter,
          topics: [
            ...currentChapter.topics,
            {
              name: title,
              id,
              position: currentChapter.topics.length,
            },
          ],
        })
      )
      .catch(showToast);
  };

  const getTopicFromChapter = (topicId, chapterId) => {
    try {
      return getChapter(chapterId).topics.find((t) => t.id === topicId);
    } catch (error) {
      return null;
    }
  };

  const renameTopicInChapter = (title, topicId, chapterId) => {
    const topic = getTopicFromChapter(topicId, chapterId);
    return renameTopicInAPI(title, topic, chapterId).then(() => {
      const currentChapter = getChapter(chapterId);
      updateChapter({
        ...currentChapter,
        topics: [
          ...currentChapter.topics.map((t) =>
            t.id === topicId ? { ...topic, name: title } : t
          ),
        ],
      });
    });
  };

  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        showToast("");
      }, 3000);
    }
  }, [toast]);

  return (
    <GlobalStateContext.Provider
      value={{
        classes,
        theme,
        showToast,
        appTheme,
        chapters,
        getChapter,
        semesters,
        updateSemester,
        addSemester,
        getSemester,
        addChapter,
        updateChapter,
        addTopic,
        renameTopicInChapter,
      }}
    >
      <MuiThemeProvider theme={appTheme}>
        {children}
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          message={toast}
          open={toast !== ""}
        />
      </MuiThemeProvider>
    </GlobalStateContext.Provider>
  );
};

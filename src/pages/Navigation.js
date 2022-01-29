import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { LibraryBooks, School } from "@material-ui/icons";

import SidebarItem from "../components/SidebarItem";
import { GlobalStateContext } from "../context/GlobalStateContext";
import { List, Drawer } from "@material-ui/core";
import Semester from "./semesters/Semester";
import Chapter from "./chapters/Chapter";
import Topics from "./chapters/Topics";
import EditTopic from "./chapters/EditTopic";

const sidebarOptions = [
  {
    title: "Semester",
    iconComponent: <School />,
    component: Semester,
  },
  {
    title: "Chapters",
    iconComponent: <LibraryBooks />,
    component: Chapter,
  },
];

const Navigation = ({ history, location }) => {
  const { classes } = useContext(GlobalStateContext);

  return (
    <div className={classes.root}>
      <nav className={classes.drawer}>
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          <List>
            {sidebarOptions.map(({ title, iconComponent }) => (
              <SidebarItem
                key={title}
                title={title}
                iconComponent={iconComponent}
                isActive={
                  location.pathname.split("/")[2] === title.toLowerCase()
                }
                onClick={() => {
                  history.push("/tool/" + title.toLowerCase());
                }}
              />
            ))}
          </List>
        </Drawer>
      </nav>
      <main className="mainbar">
        <Switch>
          <Route
            key="topics"
            path="/tool/chapters/:chapterId/topics"
            component={Topics}
          />
          <Route
            key="topics"
            path="/tool/chapters/:chapterId/view-topic/:topicId"
            component={EditTopic}
          />
          {sidebarOptions.map(({ title, component }) => (
            <Route
              key={title}
              path={"/tool/" + title.toLowerCase()}
              component={component}
            />
          ))}

          <Route
            key="default"
            path="/tool"
            component={() => <Redirect to="/tool/semester" />}
          />
        </Switch>
      </main>
    </div>
  );
};

export default Navigation;

import React from "react";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

const SidebarItem = ({ title, iconComponent, isActive, onClick }) => {
  return (
    <React.Fragment>
      <ListItem
        button
        selected={isActive}
        style={{ padding: "16px" }}
        onClick={onClick}
      >
        <ListItemIcon>{iconComponent}</ListItemIcon>
        <ListItemText className="sidebar-item-text" primary={title} />
      </ListItem>
    </React.Fragment>
  );
};
export default SidebarItem;

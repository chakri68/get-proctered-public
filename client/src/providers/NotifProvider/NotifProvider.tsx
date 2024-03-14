"use client";

import React from "react";
import "./NotifProvider.css";

export enum NotifType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
  ALERT = "alert",
  CRITICAL = "critical",
  IMPORTANT = "important",
}

export type Notif = {
  id: string;
  title: string;
  body: string;
  type: NotifType;
  timeout: {
    duration: number;
    start: number;
    ref: NodeJS.Timeout;
  } | null;
  timestamp: number;
  onClick?: () => void;
  closeable?: boolean;
};

export type NotifCreate = Omit<Notif, "id" | "timestamp" | "timeout"> & {
  timeout?: number;
};

export type NotifContextData = {
  notifs: Notif[];
  addNotif: (notif: NotifCreate) => Notif["id"];
  removeNotif: (id: Notif["id"]) => void;
};

const NotifContext = React.createContext<NotifContextData>({
  notifs: [],
  addNotif: () => "0",
  removeNotif: () => 0,
});

export const NotifProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifs, setNotifs] = React.useState<NotifContextData["notifs"]>([]);

  const addNotif: NotifContextData["addNotif"] = (notif) => {
    const id = Math.random().toString(36).substr(2, 9);
    const timeout = notif.timeout || 0;
    const timestamp = Date.now();
    delete notif.timeout;
    const newNotif: Notif = {
      ...notif,
      id,
      timestamp,
      timeout:
        timeout === 0
          ? null
          : {
              ref: setTimeout(() => {
                removeNotif(id);
              }, timeout),
              start: Date.now(),
              duration: timeout,
            },
    };
    setNotifs((prevNotifs) => [...prevNotifs, newNotif]);
    return id;
  };

  const removeNotif: NotifContextData["removeNotif"] = (id) => {
    setNotifs((prevNotifs) => {
      const notifIndex = prevNotifs.findIndex((notif) => notif.id === id);
      if (notifIndex !== -1) {
        const timeout = prevNotifs[notifIndex].timeout?.ref;
        timeout && clearTimeout(timeout);
        return [
          ...prevNotifs.slice(0, notifIndex),
          ...prevNotifs.slice(notifIndex + 1),
        ];
      }
      return prevNotifs;
    });
  };

  const removeNotifWithAnimation: NotifContextData["removeNotif"] = (id) => {
    const notif = document.getElementById(id);
    if (notif) {
      notif.classList.add("closing");
      notif.addEventListener("animationend", () => {
        removeNotif(id);
      });
    }
  };

  return (
    <NotifContext.Provider
      value={{ notifs, addNotif, removeNotif: removeNotifWithAnimation }}
    >
      <div className="notif pane">
        {notifs.map((notif) => (
          <div key={notif.id} id={notif.id} className={`notif ${notif.type}`}>
            {notif.closeable && (
              <div
                className="close"
                onClick={() => {
                  removeNotifWithAnimation(notif.id);
                }}
              >
                <span className="material-symbols-outlined icon">close</span>
              </div>
            )}
            <div
              className={`header ${notif.onClick ? "clickable" : ""}`}
              onClick={() => notif.onClick && notif.onClick()}
            >
              <NotifHeaderIcon type={notif.type} />
              <h3 className="title">{notif.title}</h3>
            </div>
            <p className="content">{notif.body}</p>
            {notif.timeout && (
              <div
                key={notif.id}
                className="progress"
                style={{
                  animationDuration: `${notif.timeout.duration}ms`,
                }}
              ></div>
            )}
          </div>
        ))}
      </div>
      {children}
    </NotifContext.Provider>
  );
};

const NotifHeaderIcon = ({ type }: { type: Notif["type"] }) => {
  switch (type) {
    case "error":
      return <span className="material-symbols-outlined icon">error</span>;
    case "warning":
      return <span className="material-symbols-outlined icon">warning</span>;
    case "success":
      return <span className="material-symbols-outlined icon">check</span>;
    case "info":
      return <span className="material-symbols-outlined icon">info</span>;
    case "alert":
      return <span className="material-symbols-outlined icon">campaign</span>;
    case "critical":
      return (
        <span className="material-symbols-outlined icon">priority_high</span>
      );
    case "important":
      return <span className="material-symbols-outlined icon">info</span>;
    default:
      return <span className="material-symbols-outlined icon">info</span>;
  }
};

export default NotifContext;

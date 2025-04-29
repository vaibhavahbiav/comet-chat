import { CometChatUIKit, UIKitSettingsBuilder } from "@cometchat/chat-uikit-react";
import { useState, useEffect } from "react";
import { CometChatMessageComposer, CometChatMessageHeader, CometChatMessageList } from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import "./App.css";
import '@cometchat/chat-uikit-react/css-variables.css';
import { CometChatSelector } from "./Components/CometChatSelector/CometChatSelector";

const COMETCHAT_CONSTANTS = {
  APP_ID: "2740737e80b46efd",
  REGION: "in",
  AUTH_KEY: "4f929d8a2045f2b47f52b75014d1c4e3e3fa7385",
};

const UIKitSettings = new UIKitSettingsBuilder()
  .setAppId(COMETCHAT_CONSTANTS.APP_ID)
  .setRegion(COMETCHAT_CONSTANTS.REGION)
  .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
  .subscribePresenceForAllUsers()
  .build();

CometChatUIKit.init(UIKitSettings)!
  .then(() => {
    console.log("CometChat UI Kit initialized successfully.");
  })
  .catch((error) => {
    console.error("CometChat UI Kit initialization failed:", error);
  });



const UID = "daltadka01";

CometChatUIKit.getLoggedinUser().then((user: CometChat.User | null) => {
  if (!user) {
    CometChatUIKit.login(UID)
      .then((user: CometChat.User) => {
        console.log("Login Successful:", { user });
      })
      .catch(console.log);
  } else {
    // If user is already logged in, mount your app
  }
});

function App() {

  const [selectedUser, setSelectedUser] = useState<CometChat.User | undefined>(undefined);
  const [selectedGroup, setSelectedGroup] = useState<CometChat.Group | undefined>(undefined);
  const [selectedCall, setSelectedCall] = useState<CometChat.Call | undefined>(undefined);

  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mediaQuery.matches ? "dark" : "light");

    const handleThemeChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleThemeChange);
    return () => mediaQuery.removeEventListener("change", handleThemeChange);
  }, []);

  return (
    <div>
      <div className="cometchat-root" data-theme={theme}>
        <div className="conversations-with-messages">
          <div className="conversations-wrapper">
            <CometChatSelector onSelectorItemClicked={(activeItem) => {
              let item = activeItem;
              if (activeItem instanceof CometChat.Conversation) {
                item = activeItem.getConversationWith();
              }
              if (item instanceof CometChat.User) {
                setSelectedUser(item as CometChat.User);
                setSelectedCall(undefined);
                setSelectedGroup(undefined);
              } else if (item instanceof CometChat.Group) {
                setSelectedUser(undefined);
                setSelectedGroup(item as CometChat.Group);
                setSelectedCall(undefined);
              }
              else if (item instanceof CometChat.Call) {
                //custom logic to open call details
                setSelectedUser(undefined);
                setSelectedGroup(undefined);
                setSelectedCall(item as CometChat.Call);
              }
            }} />
          </div>
          {selectedUser || selectedGroup || selectedCall ? (
            <div className="messages-wrapper">
              <CometChatMessageHeader user={selectedUser} group={selectedGroup} />
              <CometChatMessageList user={selectedUser} group={selectedGroup} />
              <CometChatMessageComposer user={selectedUser} group={selectedGroup} />
            </div>
          ) : (
            <div className="empty-conversation">Select Conversation to start</div>
          )}
        </div>
      </div>;
    </div>
  );
}
export default App

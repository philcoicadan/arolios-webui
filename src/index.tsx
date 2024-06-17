import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { AssociationMemberEndProvider, ClassifierProvider} from './utils/contexts';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClassifierProvider>
      <AssociationMemberEndProvider>
        <App />
      </AssociationMemberEndProvider>
    </ClassifierProvider>
  </React.StrictMode>
);

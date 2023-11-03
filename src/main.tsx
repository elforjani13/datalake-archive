import React from "react";
import ReactDOM from "react-dom/client";
import Providers from "~/providers.tsx";
import Archive from "~/archive.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <Archive />
    </Providers>
  </React.StrictMode>
);

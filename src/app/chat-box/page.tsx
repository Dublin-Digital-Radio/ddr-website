"use client";

import WidgetBot from "@widgetbot/react-embed";
import { useEffect, useState } from "react";

export default function ChatBox() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window) {
      setReady(true);
    }
  }, []);
  if (!ready) {
    return null;
  }
  return (
    <main>
      <WidgetBot
        server="1022123131948769430"
        channel="1022123131948769436"
        style={{
          width: "100%",
          height: "80vh",
        }}
      />
    </main>
  );
}

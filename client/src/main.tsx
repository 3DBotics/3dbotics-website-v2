import { createRoot } from "react-dom/client";
import "./index.css";

function App() {
  return (
    <div style={{ padding: 40, background: "green", color: "white", fontSize: 32 }}>
      ✅ 3DBotics site is loading correctly. React works!
    </div>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
} else {
  document.body.innerHTML = "<h1 style='color:red'>ROOT DIV NOT FOUND</h1>";
}

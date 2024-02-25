import "./App.css";

import Navbar from "./components/Navbar";
import AllRoutes from "./components/routers/AllRoutes";

function App() {
  return (
    <>
      <Navbar />
      {/* <NabBar /> */}
      <AllRoutes />
      {/* <h1 className="text-4xl font-bold underline">Hello world!</h1> */}
    </>
  );
}

export default App;

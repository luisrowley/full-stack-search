import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import SearchDetailsPage from "./pages/search-details";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/details/:type/:id" element={<SearchDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

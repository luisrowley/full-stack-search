import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import SearchDetailsPage from "./pages/search-details";
import NotFoundPage from "./pages/not-found";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/details/:type/:id" element={<SearchDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;

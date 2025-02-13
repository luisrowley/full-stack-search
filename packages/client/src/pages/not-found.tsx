import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-dark text-white">
      <h1 className="display-4 fw-bold">404 - Page Not Found</h1>
      <p className="lead">Oops! The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Go Back Home
      </Link>
    </div>
  );
}

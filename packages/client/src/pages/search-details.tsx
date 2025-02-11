import { useParams } from "react-router-dom";

const SearchDetailsPage = () => {
  const { type, id } = useParams();

  return (
    <div className="container">
      <h1>{`${type ? type.charAt(0).toUpperCase() +  type.slice(1) : ''} Details`}</h1>
      <h2>{id}</h2>
    </div>
  );
};

export default SearchDetailsPage;

import { useNavigate, useParams } from "react-router-dom";

const SearchDetailsPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="container">
        <button 
            onClick={handleBackClick} 
            className="btn btn-link p-0 position-absolute" 
            style={{ top: '20px', left: '20px', zIndex: 10 }}
        >
            <i className="fa fa-arrow-left" style={{ fontSize: '24px', color: '#333' }}></i>
        </button>
        <h1>{`${type ? type.charAt(0).toUpperCase() +  type.slice(1) : ''} Details`}</h1>
        <h2>{id}</h2>
    </div>
  );
};

export default SearchDetailsPage;

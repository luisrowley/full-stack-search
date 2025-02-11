import React from "react";

interface SearchDropdownProps {
  searchTerm: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearch: () => void;
  loading: boolean;
  searchResults: Record<string, { id: string; label: string; icon: string }[]>; // Generic structure
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ 
  searchTerm, 
  handleChange, 
  clearSearch, 
  loading, 
  searchResults 
}) => {
  return (
    <div className="dropdown">
      {/* Search Input */}
      <div className="form">
        <i className="fa fa-search" aria-hidden="true"></i>
        <input
          type="text"
          className="form-control form-input"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleChange}
        />
        {searchTerm && (
          <span className="left-pan" onClick={clearSearch}>
            {loading ? (
              <div className="spinner-border text-secondary ml-2" role="status"></div>
            ) : (
              <i className="fa fa-close" aria-hidden="true"></i>
            )}
          </span>
        )}
      </div>

      {/* Dropdown Results */}
      {searchTerm && (
        <div className="search-dropdown-menu dropdown-menu w-100 show p-2">
          {Object.keys(searchResults).map((category) => (
            searchResults[category].length > 0 && (
              <div key={category}>
                <h2>{category}</h2>
                <ul className="list-unstyled">
                  {searchResults[category].map((item) => (
                    <li key={item.id}>
                      <a className="dropdown-item">
                        <i className={`fa ${item.icon} mr-2`} aria-hidden="true"></i> {item.label}
                      </a>
                      <hr className="divider" />
                    </li>
                  ))}
                </ul>
              </div>
            )
          ))}

          {!loading &&
            Object.values(searchResults).every((arr) => arr.length === 0) && (
              <div className="d-flex justify-content-center align-items-center mt-2">
                <p>No results found.</p>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;

import React from "react";
import { useNavigate } from "react-router-dom";

interface SearchResultsSectionProps {
  title: string;
  items: string[] | { _id: string; hotel_name: string }[];
  iconClass: string;
  type: string;
}

const SearchResultsSection: React.FC<SearchResultsSectionProps> = ({ title, items, iconClass, type }) => {
  const navigate = useNavigate();

  if (items.length === 0) return null;

  return (
    <>
      <h2>{title}</h2>
      <ul className="list-unstyled">
        {items.map((item, index) => {
          const text = typeof item === "string" ? item : item.hotel_name;
          return (
            <li key={typeof item === "string" ? index : item._id} onClick={() => navigate(`/details/${type}/${text}`)} role="button">
              <a className="dropdown-item">
                <i className={`${iconClass} mr-2`} aria-hidden="true"></i> {text}
              </a>
              <hr className="divider" />
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default SearchResultsSection;

import { useState, type ChangeEvent, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { Hotel } from '../types/hotel';
import { API_URL, DEBOUNCE_DELAY } from '../constants/api-connection';

function HomePage () {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [countries, setCountries] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    // Debounce to reduce API calls
    const debouncedSearch = useRef(
      debounce(async (value: string) => {
        await fetchHotels(value);
      }, DEBOUNCE_DELAY)
    ).current;
  
    // Stop any pending invocation of the debounced function
    useEffect(() => {
      return () => {
        debouncedSearch.cancel();
      };
    }, []);
  
    const fetchHotels = useCallback(async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        clearSearch();
        return;
      }
  
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/hotels?search=${searchTerm}`);
  
        if (!response.ok) {
          throw new Error(`HTTP error, status: ${response.status}`);
        }
        const data = (await response.json()) as Hotel[];
        processHotelData(data, searchTerm);
      } catch (error) {
          console.error("Error fetching hotels:", error);
          clearSearch();
      } finally {
        setLoading(false);
      }
    }, []);
  
    const processHotelData = (hotelsData: Hotel[], searchTerm: string) => {
      const countrySet = new Set<string>();
      const citySet = new Set<string>();
  
      hotelsData.forEach((hotel) => {
        if (hotel.country.toLowerCase().includes(searchTerm.toLowerCase())) countrySet.add(hotel.country);
        if (hotel.city.toLowerCase().includes(searchTerm.toLowerCase())) citySet.add(hotel.city);
      });
  
      setHotels(hotelsData);
      setCountries(Array.from(countrySet));
      setCities(Array.from(citySet));
    };
  
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchTerm(value);
      debouncedSearch(value);
    };
  
    const clearSearch = () => {
      setSearchTerm("");
      setHotels([]);
      setCountries([]);
      setCities([]);
    };
  
    return (
      <div className="App">
        <div className="container">
          <div className="row height d-flex justify-content-center align-items-center">
            <div className="col-md-6">
              <div className="dropdown">
                <div className="form">
                  <i className="fa fa-search" aria-hidden="true"></i>
                  <input
                    type="text"
                    className="form-control form-input"
                    placeholder="Search accommodation..."
                    value={searchTerm}
                    onChange={handleChange}
                  />
                  {searchTerm && (
                    <span className="left-pan" role="clear-button" onClick={clearSearch}>
                      {loading ? <div className="spinner-border text-secondary ml-2" role="status"></div> :
                        <i className="fa fa-close" aria-hidden="true"></i>
                      }
                    </span>
                  )}
                </div>
                {searchTerm && (
                  <div className="search-dropdown-menu dropdown-menu w-100 show p-2">
                  {hotels.length > 0 && (
                    <>
                      <h2>Hotels</h2>
                      {hotels.map((hotel) => (
                        <ul className="list-unstyled">
                          <li key={hotel._id} onClick={() => navigate(`/details/hotels/${hotel.hotel_name}`)} role="button">
                            <a className="dropdown-item">
                              <i className="fa fa-building mr-2" aria-hidden="true"></i> {hotel.hotel_name}
                            </a>
                            <hr className="divider" />
                          </li>
                        </ul>
                      ))}
                    </>
                  )}
                  {countries.length > 0 && (
                    <>
                      <h2>Countries</h2>
                      {countries.map((country, index) => (
                        <ul className="list-unstyled">
                          <li key={index} onClick={() => navigate(`/details/countries/${country}`)} role="button">
                            <a className="dropdown-item">
                              <i className="fa fa-globe mr-2" aria-hidden="true"></i> {country}
                            </a>
                            <hr className="divider" />
                          </li>
                        </ul>
                      ))}
                    </>
                  )}
                  {cities.length > 0 && (
                    <>
                      <h2>Cities</h2>
                      {cities.map((city, index) => (
                        <ul className="list-unstyled">
                          <li key={index} onClick={() => navigate(`/details/cities/${city}`)} role="button">
                            <a className="dropdown-item">
                              <i className="fa fa-map-marker mr-2" aria-hidden="true"></i> {city}
                            </a>
                            <hr className="divider" />
                          </li>
                        </ul>
                      ))}
                    </>
                  )}
                {!loading && hotels.length === 0 && searchTerm &&
                  <div className="d-flex justify-content-center align-items-center mt-2">
                    <p>No results found.</p>
                  </div>}
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default HomePage;

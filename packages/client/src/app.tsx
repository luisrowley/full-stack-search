import { useState, type ChangeEvent, useCallback, useRef, useMemo, useEffect } from 'react';
import { getCodeSandboxHost } from "@codesandbox/utils";
import { debounce } from "lodash";
import { Hotel } from './types/hotel';

const codeSandboxHost = getCodeSandboxHost(3001);
const API_URL = codeSandboxHost ? `https://${codeSandboxHost}` : 'http://localhost:3001';
const DEBOUNCE_DELAY = 300;

function App() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  // Debounce to reduce API calls
  const debouncedSearch = useRef(debounce(handleSearch, DEBOUNCE_DELAY)).current;

  // Stop any pending invocation of the debounced function
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  const fetchHotels = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) return [];

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/hotels?search=${searchTerm}`);

      if (!response.ok) {
        throw new Error(`HTTP error, status: ${response.status}`);
      }
      const data = await response.json();
      return data as Hotel[];

    } catch (error) {
        console.error("Error fetching hotels:", error);
        return [];
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleSearch (value: string) {
    if (!value.trim()) {
      clearSearch();
      return;
    }

    const filteredHotels = await fetchHotels(value);
    const countrySet = new Set<string>();
    const citySet = new Set<string>();

    filteredHotels.forEach((hotel) => {
      if (hotel.country.toLowerCase().includes(value.toLowerCase())) {
        countrySet.add(hotel.country);
      }
      if (hotel.city.toLowerCase().includes(value.toLowerCase())) {
        citySet.add(hotel.city);
      }
    });

    setHotels(filteredHotels);
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
                <i className="fa fa-search"></i>
                <input
                  type="text"
                  className="form-control form-input"
                  placeholder="Search accommodation..."
                  value={searchTerm}
                  onChange={handleChange}
                />
                {searchTerm && (
                  <span className="left-pan" onClick={clearSearch}>
                    {loading ? <div className="spinner-border text-secondary ml-2" role="status"></div> :
                      <i className="fa fa-close"></i>
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
                      <li key={hotel._id}>
                        <a className="dropdown-item">
                          <i className="fa fa-building mr-2"></i> {hotel.hotel_name}
                        </a>
                        <hr className="divider" />
                      </li>
                    ))}
                  </>
                )}
                {countries.length > 0 && (
                  <>
                    <h2>Countries</h2>
                    {countries.map((country, index) => (
                      <li key={index}>
                        <a className="dropdown-item">
                          <i className="fa fa-globe mr-2"></i> {country}
                        </a>
                        <hr className="divider" />
                      </li>
                    ))}
                  </>
                )}
                {cities.length > 0 && (
                  <>
                    <h2>Cities</h2>
                    {cities.map((city, index) => (
                      <li key={index}>
                        <a className="dropdown-item">
                          <i className="fa fa-map-marker mr-2"></i> {city}
                        </a>
                        <hr className="divider" />
                      </li>
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

export default App;

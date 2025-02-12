import { useState, type ChangeEvent, useCallback, useRef, useEffect } from 'react';
import { debounce } from "lodash";
import { Hotel } from '../types/hotel';
import { DEBOUNCE_DELAY } from '../constants/api-connection';
import { sanitizeInput } from '../utils/sanitizers';
import SearchResultsSection from '../components/SearchResultsSection';
import { fetchHotels } from '../services/hotelService';

function HomePage () {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [countries, setCountries] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
  
    // Debounce to reduce API calls
    const debouncedSearch = useRef(
      debounce(async (value: string) => {
        await handleFetchHotels(value);
      }, DEBOUNCE_DELAY)
    ).current;
  
    // Stop any pending invocation of the debounced function
    useEffect(() => {
      return () => {
        debouncedSearch.cancel();
      };
    }, []);

    const handleFetchHotels = useCallback(async (searchTerm: string) => {
      setLoading(true);
      try {
        const data = await fetchHotels(searchTerm);
        processHotelData(data, searchTerm);
      } catch {
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
      const value = sanitizeInput(event.target.value);
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
                    <SearchResultsSection title="Hotels" items={hotels} iconClass="fa fa-building" />
                  )}
                  {countries.length > 0 && (
                    <SearchResultsSection title="Countries" items={countries} iconClass="fa fa-globe" />
                  )}
                  {cities.length > 0 && (
                    <SearchResultsSection title="Cities" items={cities} iconClass="fa fa-map-marker" />
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

import { API_URL } from "../constants/api-connection";
import { Hotel } from "../types/hotel";

export const fetchHotels = async (searchTerm: string): Promise<Hotel[]> => {
  if (!searchTerm.trim()) return [];

  try {
    const response = await fetch(`${API_URL}/hotels?search=${searchTerm}`);

    if (!response.ok) {
      throw new Error(`HTTP error, status: ${response.status}`);
    }

    return (await response.json()) as Hotel[];
  } catch (error) {
    console.error("Error fetching hotels:", error);
    throw error;
  }
};

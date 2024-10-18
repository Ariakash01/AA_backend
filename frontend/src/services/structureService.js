// services/structureService.js
import axios from 'axios';

// Set the base URL for the API if needed
const baseURL = '/api/structure';

/**
 * Get structure by ID
 * @param {String} structureId - The ID of the structure
 * @returns {Promise} - Returns a promise with the structure data
 */
export const getStructureById = async (structureId) => {
  try {
    const response = await axios.get(`${baseURL}/${structureId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching structure:", error);
    throw error;
  }
};

/**
 * Submit a new structure
 * @param {Object} structureData - The structure data to be submitted
 * @returns {Promise} - Returns a promise with the response
 */
export const submitStructure = async (structureData) => {
  try {
    const response = await axios.post(`${baseURL}/submit`, structureData);
    return response.data;
  } catch (error) {
    console.error("Error submitting structure:", error);
    throw error;
  }
};

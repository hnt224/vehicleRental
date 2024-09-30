import React, { useState, useEffect } from 'react';
import ApiService from '../../service/ApiService';  // Service to handle API calls
import Pagination from '../common/Pagination';  // Component for pagination
import VehicleResult from '../common/VehicleResult';  // Component to display list of vehicles
import VehicleSearch from '../common/VehicleSearch';  // Component to handle vehicle search functionality

const AllVehiclesPage = () => {
  // State variables
  const [vehicles, setVehicles] = useState([]);  // State to store all vehicles
  const [filteredVehicles, setFilteredVehicles] = useState([]);  // State for filtered vehicles based on type or search
  const [vehicleTypes, setVehicleTypes] = useState([]);  // State to store vehicle types for filtering
  const [selectedVehicleType, setSelectedVehicleType] = useState('');  // State to store the selected vehicle type for filtering
  const [currentPage, setCurrentPage] = useState(1);  // State to track the current page in pagination
  const [vehiclesPerPage] = useState(5);  // Number of vehicles to display per page

  // Function to handle search results coming from VehicleSearch component
  const handleSearchResult = (results) => {
    setVehicles(results);  // Set the vehicle state with search results
    setFilteredVehicles(results);  // Update filtered vehicles with search results
  };

  // Fetch all vehicles and vehicle types when the component mounts
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await ApiService.getAllVehicles();  // Fetch all vehicles from the API
        const allVehicles = response.vehicleList;  // Get the list of vehicles from the API response
        setVehicles(allVehicles);  // Store all vehicles in state
        setFilteredVehicles(allVehicles);  // Initially, all vehicles are displayed
      } catch (error) {
        console.error('Error fetching vehicles:', error.message);  // Log any errors during the fetch
      }
    };

    const fetchVehicleTypes = async () => {
      try {
        const types = await ApiService.getVehicleTypes();  // Fetch vehicle types from the API
        setVehicleTypes(types);  // Store vehicle types in state for filtering
      } catch (error) {
        console.error('Error fetching vehicle types:', error.message);  // Log any errors during the fetch
      }
    };

    fetchVehicles();  // Fetch vehicles when the component loads
    fetchVehicleTypes();  // Fetch vehicle types when the component loads
  }, []);

  // Handle change in vehicle type filter
  const handleVehicleTypeChange = (e) => {
    setSelectedVehicleType(e.target.value);  // Update the selected vehicle type based on user selection
    filterVehicles(e.target.value);  // Call the filter function to display only vehicles of the selected type
  };

  // Filter vehicles based on selected vehicle type
  const filterVehicles = (type) => {
    if (type === '') {
      setFilteredVehicles(vehicles);  // Show all vehicles if no type is selected
    } else {
      const filtered = vehicles.filter((vehicle) => vehicle.vehicleType === type);  // Filter vehicles by the selected type
      setFilteredVehicles(filtered);  // Update the state with filtered vehicles
    }
    setCurrentPage(1);  // Reset to the first page after filtering
  };

  // Pagination logic
  const indexOfLastVehicle = currentPage * vehiclesPerPage;  // Calculate index of the last vehicle on the current page
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;  // Calculate index of the first vehicle on the current page
  const currentVehicles = filteredVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);  // Get the vehicles to display on the current page

  // Function to change the current page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='all-vehicles'>
      <h2>All Vehicles</h2>

      {/* Dropdown for filtering vehicles by type */}
      <div className='all-vehicle-filter-div'>
        <label>Filter by Vehicle Type:</label>
        <select value={selectedVehicleType} onChange={handleVehicleTypeChange}>
          <option value="">All</option>  {/* Default option to show all vehicles */}
          {vehicleTypes.map((type) => (
            <option key={type} value={type}>
              {type}  {/* Render each vehicle type in the dropdown */}
            </option>
          ))}
        </select>
      </div>

      {/* VehicleSearch component for searching vehicles by other criteria */}
      <VehicleSearch handleSearchResult={handleSearchResult} />
      
      {/* Display the list of vehicles */}
      <VehicleResult vehicleSearchResults={currentVehicles} />

      {/* Pagination component to navigate between pages */}
      <Pagination
        vehiclesPerPage={vehiclesPerPage}  // Number of vehicles to show per page
        totalVehicles={filteredVehicles.length}  // Total number of filtered vehicles
        currentPage={currentPage}  // Current page number
        paginate={paginate}  // Function to handle page change
      />
    </div>
  );
};

export default AllVehiclesPage;

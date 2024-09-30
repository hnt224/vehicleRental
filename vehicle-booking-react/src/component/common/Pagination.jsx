import React from 'react';

// Pagination component to display page numbers and handle page changes
const Pagination = ({ vehiclesPerPage, totalVehicles, currentPage, paginate }) => {
  // Array to store the page numbers
  const pageNumbers = [];

  // Calculate the total number of pages and populate the pageNumbers array
  // We use Math.ceil to ensure that if there are remaining vehicles that don't fill a full page, an extra page is added
  for (let i = 1; i <= Math.ceil(totalVehicles / vehiclesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className='pagination-nav'>
      <ul className="pagination-ul">
        {/* Map over the pageNumbers array to create a list item for each page number */}
        {pageNumbers.map((number) => (
          <li key={number} className="pagination-li">
            {/* Button for each page number */}
            <button 
              onClick={() => paginate(number)} // Call paginate function with the page number when the button is clicked
              className={`pagination-button ${currentPage === number ? 'current-page' : ''}`} // Add 'current-page' class if this is the current page
            >
              {number} {/* Display the page number */}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Pagination;

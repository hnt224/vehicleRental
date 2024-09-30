import React from 'react'
import { useNavigate } from 'react-router-dom'
import ApiService from '../../service/ApiService'

const VehicleResult = ({vehicleSearchResults}) => {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const isAdmin = ApiService.isAdmin();
    return (
        <section className="vehicle-results">
            {vehicleSearchResults && vehicleSearchResults.length > 0 && (
                <div className="vehicle-list">
                    {vehicleSearchResults.map(vehicle => (
                        <div key={vehicle.id} className="vehicle-list-item">

                            <img className='vehicle-list-item-image' src={vehicle.vehiclePhotoUrl} alt={vehicle.vehicleType} />
                               {console.log(vehicle.vehiclePhotoUrl)}
                            <div className="vehicle-details">
                                <h3>{vehicle.vehicleType}</h3>
                                <p>Price: ${vehicle.vehiclePrice} / day</p>
                                <p>Description: {vehicle.vehicleDescription}</p>
                            </div>

                            <div className='book-now-div'>
                                {isAdmin ? (
                                    <button
                                        className="edit-vehicle-button"
                                        onClick={() => navigate(`/admin/edit-vehicle/${vehicle.id}`)} // Navigate to edit vehicle with vehicle ID
                                    >
                                        Edit vehicle
                                    </button>
                                ) : (
                                    <button
                                        className="book-now-button"
                                        onClick={() => navigate(`/vehicle-details-book/${vehicle.id}`)} // Navigate to book vehicle with vehicle ID
                                    >
                                        View/Book Now
                                    </button>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default VehicleResult

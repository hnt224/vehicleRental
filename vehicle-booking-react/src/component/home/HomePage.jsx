import React, { useState } from "react";
import VehicleResult from "../common/VehicleResult";
import VehicleSearch from "../common/VehicleSearch";



const HomePage = () => {

    const [vehicleSearchResults, setVehicleSearchResults] = useState([]);

    // Function to handle search results
    const handleSearchResult = (results) => {
        setVehicleSearchResults(results);
    };

    return (
        <div className="home">
            {/* HEADER / BANNER VEHICLE SECTION */}
            <section>
                <header className="header-banner">
                    <img src="./assets/images/home.png" alt="AutoReserve" className="header-image" />
                    <div className="overlay"></div>
                    <div className="animated-texts overlay-content">
                        <h1>
                         <span className="autoreserve-color">Welcome to AutoReserve</span>
                        </h1><br />
                        <h3 className= "autoreserve-color">Step into a city of comfortable and affordable cars</h3>
                    </div>
                </header>
            </section>

            {/* SEARCH/FIND AVAILABLE VEHICLE SECTION */}
            <VehicleSearch handleSearchResult={handleSearchResult} />
            <VehicleResult vehicleSearchResults={vehicleSearchResults} />

            <h4><a className="view-vehicles-home" href="/vehicles">All Vehicles</a></h4>

            <h2 className="home-services">Services at <span className="phegon-color">AutoReserve</span></h2>

            {/* SERVICES SECTION */}
            <section className="service-section"><div className="service-card">
                <img src="./assets/images/4749535.png" alt="Air Conditioning" />
                <div className="service-details">
                    <h3 className="service-title">Air Conditioning</h3>
                    <p className="service-description">Stay cool and comfortable throughout your stay with our individually controlled in-room air conditioning.</p>
                </div>
            </div>
                <div className="service-card">
                    <img src="./assets/images/4970213.png" alt="Refreshments" />
                    <div className="service-details">
                        <h3 className="service-title">Refreshments</h3>
                        <p className="service-description">Enjoy a convenient selection of beverages and snacks stocked in our pantry with no additional cost.</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./assets/images/parking.png" alt="Parking" />
                    <div className="service-details">
                        <h3 className="service-title">Parking</h3>
                        <p className="service-description">We offer on-site parking for your convenience while you rent out another vehicle for a long trip. Ask about our valet parking at your next visit.</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./assets/images/wifi.jpg" alt="WiFi" />
                    <div className="service-details">
                        <h3 className="service-title">WiFi</h3>
                        <p className="service-description">Stay connected throughout your stay with complimentary high-speed Wi-Fi access available in all public areas.</p>
                    </div>
                </div>

            </section>
            {/* AVAILABLE VEHICLES SECTION */}
            <section>

            </section>
        </div>
    );
}

export default HomePage;
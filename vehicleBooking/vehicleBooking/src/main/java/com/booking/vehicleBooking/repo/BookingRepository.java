package com.booking.vehicleBooking.repo;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.booking.vehicleBooking.entity.Booking;


public interface BookingRepository extends JpaRepository<Booking, Long>{


	
	Optional<Booking> findByBookingConfirmationCode(String confirmationCode);
	

}

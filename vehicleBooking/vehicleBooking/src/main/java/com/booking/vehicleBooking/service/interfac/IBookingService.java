package com.booking.vehicleBooking.service.interfac;

import com.booking.vehicleBooking.dto.Response;
import com.booking.vehicleBooking.entity.Booking;

public interface IBookingService {
	
	Response saveBooking(Long vehicleId, Long userId, Booking bookingRequest);
	
	Response findBookingByConfirmationCode(String confirmationCode);
	
	Response getAllBookings();
	
	Response cancelBooking(Long bookingId);
}

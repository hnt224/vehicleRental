package com.booking.vehicleBooking.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.booking.vehicleBooking.dto.BookingDTO;
import com.booking.vehicleBooking.dto.Response;
import com.booking.vehicleBooking.entity.Booking;
import com.booking.vehicleBooking.entity.User;
import com.booking.vehicleBooking.entity.Vehicle;
import com.booking.vehicleBooking.exception.CustomException;
import com.booking.vehicleBooking.repo.BookingRepository;
import com.booking.vehicleBooking.repo.UserRepository;
import com.booking.vehicleBooking.repo.VehicleRepository;
import com.booking.vehicleBooking.service.interfac.IBookingService;
import com.booking.vehicleBooking.service.interfac.IVehicleService;
import com.booking.vehicleBooking.utils.Utils;

@Service
public class BookingService implements IBookingService{

	@Autowired
	private BookingRepository bookingRepository;
	
	@Autowired
	private VehicleRepository vehicleRepository;
	
	@Autowired
	private IVehicleService vehicleService;
	
	@Autowired
	private UserRepository userRepository;
	
	
	@Override
	 public Response saveBooking(Long vehicleId, Long userId, Booking bookingRequest) {

        Response response = new Response();

        try {
            if (bookingRequest.getCheckOutDate().isBefore(bookingRequest.getCheckInDate())) {
                throw new IllegalArgumentException("Check in date must come after check out date");
            }
            Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(() -> new CustomException("Vehicle Not Found"));
            User user = userRepository.findById(userId).orElseThrow(() -> new CustomException("User Not Found"));

            List<Booking> existingBookings = vehicle.getBookings();

            if (!vehicleIsAvailable(bookingRequest, existingBookings)) {
                throw new CustomException("Vehicle not Available for selected date range");
            }

            bookingRequest.setVehicle(vehicle);
            bookingRequest.setUser(user);
            String bookingConfirmationCode = Utils.generateRandomConfirmationCode(10);
            bookingRequest.setBookingConfirmationCode(bookingConfirmationCode);
            bookingRepository.save(bookingRequest);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setBookingConfirmationCode(bookingConfirmationCode);

        } catch (CustomException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Saving a booking: " + e.getMessage());

        }
        return response;
    }

	   @Override
	    public Response findBookingByConfirmationCode(String confirmationCode) {

	        Response response = new Response();

	        try {
	            Booking booking = bookingRepository.findByBookingConfirmationCode(confirmationCode).orElseThrow(() -> new CustomException("Booking Not Found"));
	            BookingDTO bookingDTO = Utils.mapBookingEntityToBookingDTOPlusBookedVehicle(booking, true);
	            response.setStatusCode(200);
	            response.setMessage("successful");
	            response.setBooking(bookingDTO);

	        } catch (CustomException e) {
	            response.setStatusCode(404);
	            response.setMessage(e.getMessage());

	        } catch (Exception e) {
	            response.setStatusCode(500);
	            response.setMessage("Error Finding a booking: " + e.getMessage());

	        }
	        return response;
	    }

	@Override
	public Response getAllBookings() {
		
		Response response = new Response();
		
		try {
			List<Booking> bookingList = bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
			List<BookingDTO> bookingDTOList = Utils.mapBookingListEntityToBookingListDTO(bookingList);
			
			response.setStatusCode(200);
			response.setMessage("Success");
			response.setBookingList(bookingDTOList);
			
			
		}catch (Exception e) {
			response.setStatusCode(500);
			response.setMessage("Error getting all bookings" + e.getMessage());
		} 

		return response;
	}

	@Override
	 public Response cancelBooking(Long bookingId) {

        Response response = new Response();

        try {
            bookingRepository.findById(bookingId).orElseThrow(() -> new CustomException("Booking Does Not Exist"));
            bookingRepository.deleteById(bookingId);
            response.setStatusCode(200);
            response.setMessage("successful");

        } catch (CustomException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Cancelling a booking: " + e.getMessage());

        }
        return response;
    }
	
	

	private boolean vehicleIsAvailable(Booking bookingRequest, List<Booking> existingBookings) {
		 return existingBookings.stream()
	                .noneMatch(existingBooking ->
	                        bookingRequest.getCheckInDate().equals(existingBooking.getCheckInDate())
	                                || bookingRequest.getCheckOutDate().isBefore(existingBooking.getCheckOutDate())
	                                || (bookingRequest.getCheckInDate().isAfter(existingBooking.getCheckInDate())
	                                && bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckOutDate()))
	                                || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())

	                                && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckOutDate()))
	                                || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())

	                                && bookingRequest.getCheckOutDate().isAfter(existingBooking.getCheckOutDate()))

	                                || (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
	                                && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckInDate()))

	                                || (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
	                                && bookingRequest.getCheckOutDate().equals(bookingRequest.getCheckInDate()))
	                );
	}

}

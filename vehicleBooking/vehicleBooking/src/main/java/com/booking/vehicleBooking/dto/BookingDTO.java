package com.booking.vehicleBooking.dto;

import java.time.LocalDate;


import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BookingDTO {

	private Long id;

	private LocalDate checkInDate;

	private LocalDate checkOutDate;
	
	private int numOfPassengers;
	
	private int numOfMiles;
	
	private String bookingConfirmationCode;
	
	private UserDTO user;
	
	private VehicleDTO vehicle;
}

package com.booking.vehicleBooking.dto;


import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {
	
	private int statusCode;
	private String message;
	private String token;	
	private String role;	
	private String bookingConfirmationCode;
	private UserDTO user;
	private VehicleDTO vehicle;
	private BookingDTO booking;
	private String expirationTime;

	private List<UserDTO> userList;
	private List<VehicleDTO> vehicleList;
	private List<BookingDTO> bookingList;
}

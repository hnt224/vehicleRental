package com.booking.vehicleBooking.utils;

import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

import com.booking.vehicleBooking.dto.BookingDTO;
import com.booking.vehicleBooking.dto.UserDTO;
import com.booking.vehicleBooking.dto.VehicleDTO;
import com.booking.vehicleBooking.entity.Booking;
import com.booking.vehicleBooking.entity.User;
import com.booking.vehicleBooking.entity.Vehicle;

public class Utils {
	
	private static final String ALPHANUMERIC_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	private static final SecureRandom secureRandom = new SecureRandom();
	
	public static String generateRandomConfirmationCode(int length) {
		StringBuilder stringBuilder = new StringBuilder();
		for(int i = 0; i < length; i++) {
			int randomIndex = secureRandom.nextInt(ALPHANUMERIC_STRING.length());
			char randomChar = ALPHANUMERIC_STRING.charAt(randomIndex);
			stringBuilder.append(randomChar);
		}
		
		return stringBuilder.toString();
	}
	
	//Map user entity to user DTO
	public static UserDTO mapUserEntityToUserDTO(User user) {
		UserDTO userDTO = new UserDTO();
		
		userDTO.setId(user.getId());
		userDTO.setName(user.getName());
		userDTO.setEmail(user.getEmail());
		userDTO.setPhoneNumber(user.getPhoneNumber());
		userDTO.setRole(user.getRole());
		
		return userDTO; 
	}
	
	public static VehicleDTO mapVehicleEntityToVehicleDTO(Vehicle vehicle) {
		VehicleDTO vehicleDTO = new VehicleDTO();
		
		vehicleDTO.setId(vehicle.getId());
		vehicleDTO.setVehicleType(vehicle.getVehicleType());
		vehicleDTO.setVehiclePrice(vehicle.getVehiclePrice());
		vehicleDTO.setVehiclePhotoUrl(vehicle.getVehiclePhotoUrl());
		vehicleDTO.setVehicleDescription(vehicle.getVehicleDescription());
		return vehicleDTO; 
	}
	
	public static BookingDTO mapBookingEntityToBookingDTO(Booking booking) {
		BookingDTO bookingDTO = new BookingDTO();
		
		bookingDTO.setId(booking.getId());
		bookingDTO.setCheckInDate(booking.getCheckInDate());
		bookingDTO.setCheckOutDate(booking.getCheckOutDate());
		bookingDTO.setNumOfPassengers(booking.getNumOfPassengers());
		bookingDTO.setNumOfMiles(booking.getNumOfMiles());
		bookingDTO.setBookingConfirmationCode(booking.getBookingConfirmationCode());
		return bookingDTO;
	}
	
	public static VehicleDTO mapVehicleEntityToVehicleDTOPlusBookings(Vehicle vehicle) {
	    VehicleDTO vehicleDTO = new VehicleDTO();
	    
	    vehicleDTO.setId(vehicle.getId());
	    vehicleDTO.setVehicleType(vehicle.getVehicleType());
	    vehicleDTO.setVehiclePrice(vehicle.getVehiclePrice());
	    vehicleDTO.setVehiclePhotoUrl(vehicle.getVehiclePhotoUrl());
	    vehicleDTO.setVehicleDescription(vehicle.getVehicleDescription());
	    
	    if (vehicle.getBookings() != null) {
	        vehicleDTO.setBookings(vehicle.getBookings().stream()
	            .map(Utils::mapBookingEntityToBookingDTO)
	            .collect(Collectors.toList()));
	    }

	    return vehicleDTO; 
	}
	
	public static UserDTO mapUserEntityToUserDTOPlusUserBookingsAndRoom(User user) {
	    UserDTO userDTO = new UserDTO();
	    
	    userDTO.setId(user.getId());
	    userDTO.setName(user.getName());
	    userDTO.setEmail(user.getEmail());
	    userDTO.setPhoneNumber(user.getPhoneNumber());
	    userDTO.setRole(user.getRole());
	    
	
	    if (!user.getBookings().isEmpty()) {
            userDTO.setBookings(user.getBookings().stream().map(booking -> mapBookingEntityToBookingDTOPlusBookedVehicle(booking, false)).collect(Collectors.toList()));
        }

	    return userDTO; 
	}

	public static BookingDTO mapBookingEntityToBookingDTOPlusBookedVehicle(Booking booking, boolean mapUser) {
		  BookingDTO bookingDTO = new BookingDTO();

		  	bookingDTO.setId(booking.getId());
			bookingDTO.setCheckInDate(booking.getCheckInDate());
			bookingDTO.setCheckOutDate(booking.getCheckOutDate());
			bookingDTO.setNumOfPassengers(booking.getNumOfPassengers());
			bookingDTO.setNumOfMiles(booking.getNumOfMiles());
			bookingDTO.setBookingConfirmationCode(booking.getBookingConfirmationCode());
	        if (mapUser) {
	            bookingDTO.setUser(Utils.mapUserEntityToUserDTO(booking.getUser()));
	        }
	        if (booking.getVehicle() != null) {
	           	VehicleDTO vehicleDTO = new VehicleDTO();
	           	
	            vehicleDTO.setId(booking.getVehicle().getId());
	    	    vehicleDTO.setVehicleType(booking.getVehicle().getVehicleType());
	    	    vehicleDTO.setVehiclePrice(booking.getVehicle().getVehiclePrice());
	    	    vehicleDTO.setVehiclePhotoUrl(booking.getVehicle().getVehiclePhotoUrl());
	    	    vehicleDTO.setVehicleDescription(booking.getVehicle().getVehicleDescription());
	    	    
	    	    bookingDTO.setVehicle(vehicleDTO);
	        }
	        return bookingDTO;
	}
	
	public static List<UserDTO> mapUserListEntityToUserListDTO(List<User> userList){
		return userList.stream().map(Utils::mapUserEntityToUserDTO).collect(Collectors.toList());
	}
	
	public static List<VehicleDTO> mapVehicleListEntityToVehicleListDTO(List<Vehicle> vehicleList){
		return vehicleList.stream().map(Utils::mapVehicleEntityToVehicleDTO).collect(Collectors.toList());
	}
	
	public static List<BookingDTO> mapBookingListEntityToBookingListDTO(List<Booking> bookingList){
		return bookingList.stream().map(Utils::mapBookingEntityToBookingDTO).collect(Collectors.toList());
	}
}

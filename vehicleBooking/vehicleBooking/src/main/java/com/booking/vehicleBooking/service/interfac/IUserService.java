package com.booking.vehicleBooking.service.interfac;

import com.booking.vehicleBooking.dto.LoginRequest;
import com.booking.vehicleBooking.dto.Response;
import com.booking.vehicleBooking.entity.User;

public interface IUserService {
	Response register(User user);
	
	Response login(LoginRequest loginRequest);
	
	Response getAllUsers(); 
	
	Response getUserBookingHistory(String userId); 
	
	Response deleteUser(String userId);
	
	Response getUserById(String userId);
	
	Response getMyInfo(String email);
}

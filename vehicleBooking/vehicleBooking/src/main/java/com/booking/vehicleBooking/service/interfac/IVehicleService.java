package com.booking.vehicleBooking.service.interfac;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.booking.vehicleBooking.dto.Response;


public interface IVehicleService {
	
	Response addNewVehicle(MultipartFile photo, String vehicleType, BigDecimal vehiclePrice, String description);
	
	Response getAllVehicles();
	
	List<String> getAllVehicleTypes();
	
	Response deleteVehicle(Long vehicleId);
	
	Response updateVehicle(Long vehicleId,String description, String vehicleType, BigDecimal vehiclePrice, MultipartFile photo);
	
	Response getVehicleById(Long vehicleId);
	
	Response getAvailableVehiclesByDateAndTypes(LocalDate checkInDate, LocalDate checkOutDate, String vehicleType);
	
	Response getAllAvailableVehicles();
}

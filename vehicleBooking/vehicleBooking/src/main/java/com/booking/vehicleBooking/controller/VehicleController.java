package com.booking.vehicleBooking.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.booking.vehicleBooking.dto.Response;
import com.booking.vehicleBooking.service.interfac.IBookingService;
import com.booking.vehicleBooking.service.interfac.IVehicleService;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {
	
	@Autowired
	private IVehicleService vehicleService;
	
	@Autowired
	private IBookingService iBookingService;
	
	@PostMapping("/add")
	@PreAuthorize("hasAuthority('ADMIN')") //only admins have access to this
	public ResponseEntity<Response> getNewVehicle(
			@RequestParam(value = "photo", required= false) MultipartFile photo,
			@RequestParam(value = "vehicleType", required= false) String vehicleType,
			@RequestParam(value = "vehiclePrice", required= false) BigDecimal vehiclePrice,
			@RequestParam(value = "vehicleDescription", required= false) String vehicleDescription
			){
		
		if(photo == null || photo.isEmpty() || vehicleType == null || vehicleType.isBlank() || vehiclePrice == null 
				) {
			Response response = new Response();
			response.setStatusCode(400);
			response.setMessage("Provide values for all fields (photo, vehicle type, vehicle price)");
			return ResponseEntity.status(response.getStatusCode()).body(response);

		}
		
		Response response = vehicleService.addNewVehicle(photo, vehicleType, vehiclePrice, vehicleDescription);
		return ResponseEntity.status(response.getStatusCode()).body(response);
	}
	
	
	@GetMapping("/all")
	public ResponseEntity<Response> getAllVehicles(){
		Response response = vehicleService.getAllVehicles();
		return ResponseEntity.status(response.getStatusCode()).body(response);
	}
	
	@GetMapping("/types")
	public List<String> getVehicleTypes(){
		return vehicleService.getAllVehicleTypes();
	}
	
	@GetMapping("/vehicle-by-id/{vehicleId}")
	public ResponseEntity<Response> getVehicleById(@PathVariable Long vehicleId){

		Response response = vehicleService.getVehicleById(vehicleId);
		return ResponseEntity.status(response.getStatusCode()).body(response);
	}
	
	@GetMapping("/all-available-vehicles")
	public ResponseEntity<Response> getAvailableVehicles(){

		Response response = vehicleService.getAllAvailableVehicles();
		return ResponseEntity.status(response.getStatusCode()).body(response);
	}
	
	
	@GetMapping("/available-vehicles-by-date-and-type")
	public ResponseEntity<Response> getAvailableVehiclesByDateAndType(
			@RequestParam( required= false)@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
			@RequestParam(required= false)@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate,
			@RequestParam( required= false) String vehicleType
			){
		
		if(checkInDate == null || vehicleType == null || vehicleType.isBlank() || checkOutDate == null 
				) {
			Response response = new Response();
			response.setStatusCode(400);
			response.setMessage("Provide values for all fields (check in dates, check out dates, vehicle type)");
			return ResponseEntity.status(response.getStatusCode()).body(response);

		}
		
		Response response = vehicleService.getAvailableVehiclesByDateAndTypes(checkInDate, checkOutDate, vehicleType);
		return ResponseEntity.status(response.getStatusCode()).body(response);
	}
	
	
	@PutMapping("/update/{vehicleId}")
	@PreAuthorize("hasAuthority('ADMIN')") //only admins have access to this
	public ResponseEntity<Response> updateVehicle(
			@PathVariable Long vehicleId, 
			@RequestParam(value = "photo", required= false) MultipartFile photo,
			@RequestParam(value = "vehicleType", required= false) String vehicleType,
			@RequestParam(value = "vehiclePrice", required= false) BigDecimal vehiclePrice,
			@RequestParam(value = "vehicleDescription", required= false) String vehicleDescription
			
			){
			Response response = vehicleService.updateVehicle(vehicleId, vehicleDescription, vehicleType, vehiclePrice, photo);
			return ResponseEntity.status(response.getStatusCode()).body(response);
		
	}
	
	@DeleteMapping("/delete/{vehicleId}")
	@PreAuthorize("hasAuthority('ADMIN')") //only admins have access to this
	public ResponseEntity<Response> deleteVehicle(@PathVariable Long vehicleId){
		Response response = vehicleService.deleteVehicle(vehicleId);
		return ResponseEntity.status(response.getStatusCode()).body(response);

	}
	
	
}

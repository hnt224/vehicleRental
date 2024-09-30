package com.booking.vehicleBooking.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.booking.vehicleBooking.dto.Response;
import com.booking.vehicleBooking.dto.VehicleDTO;
import com.booking.vehicleBooking.entity.Vehicle;
import com.booking.vehicleBooking.exception.CustomException;
import com.booking.vehicleBooking.repo.BookingRepository;
import com.booking.vehicleBooking.repo.VehicleRepository;
import com.booking.vehicleBooking.service.interfac.IVehicleService;
import com.booking.vehicleBooking.utils.Utils;

@Service
public class VehicleService implements IVehicleService{
	
	@Autowired
	private VehicleRepository vehicleRepository;
	
	@Autowired
	private BookingRepository bookingRepository;
	
	@Autowired
	private AwsS3Service awsS3Service;
	
	@Override
	public Response addNewVehicle(MultipartFile photo, String vehicleType, BigDecimal vehiclePrice,
			String description) {
		
		Response response = new Response();
		
		try {
			
			String imageUrl = awsS3Service.saveImageToS3(photo);
			Vehicle vehicle = new Vehicle();
			
			vehicle.setVehiclePhotoUrl(imageUrl);
			vehicle.setVehicleType(vehicleType);
			vehicle.setVehiclePrice(vehiclePrice);
			vehicle.setVehicleDescription(description);
			
			Vehicle savedVehicle = vehicleRepository.save(vehicle); 
			VehicleDTO vehicleDTO = Utils.mapVehicleEntityToVehicleDTO(savedVehicle);
			response.setStatusCode(200);
			response.setMessage("Success");
			response.setVehicle(vehicleDTO);
			
		}catch (Exception e) {
			response.setStatusCode(500);
			response.setMessage("Error adding new vehicle" + e.getMessage());
		}
		return response;
	}

	@Override
	public Response getAllVehicles() {
		
		Response response = new Response();
		
		try {
			
			List<Vehicle> vehicleList = vehicleRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
			List<VehicleDTO> vehicleDTOList = Utils.mapVehicleListEntityToVehicleListDTO(vehicleList);
			
			response.setStatusCode(200);
			response.setMessage("Success");
			response.setVehicleList(vehicleDTOList);
			
		}catch (Exception e) {
			response.setStatusCode(500);
			response.setMessage("Error getting all vehicle" + e.getMessage());
		}
		return response;
		
	}

	@Override
	public List<String> getAllVehicleTypes() {
		return vehicleRepository.findDistinctVehicleTypes();
		
	}

	@Override
	public Response deleteVehicle(Long vehicleId) {
		
		Response response = new Response();
		
		try {
			
			vehicleRepository.findById(vehicleId).orElseThrow(() -> new CustomException("Vehicle not found"));
			vehicleRepository.deleteById(vehicleId);
			response.setStatusCode(200);
			response.setMessage("Success");
			
			
		}catch(CustomException e) {
			response.setStatusCode(404);
			response.setMessage(e.getMessage());
			
		}
		catch (Exception e) {
			response.setStatusCode(500);
			response.setMessage("Error deleting vehicle" + e.getMessage());
		}
		return response;
	}

	 @Override
	    public Response updateVehicle(Long vehicleId, String description, String vehicleType, BigDecimal vehiclePrice, MultipartFile photo) {
	        Response response = new Response();

	        try {
	            String imageUrl = null;
	            if (photo != null && !photo.isEmpty()) {
	                imageUrl = awsS3Service.saveImageToS3(photo);
	            }
	            Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(() -> new CustomException("Vehicle Not Found"));
	            if (vehicleType != null) vehicle.setVehicleType(vehicleType);
	            if (vehiclePrice != null) vehicle.setVehiclePrice(vehiclePrice);
	            if (description != null) vehicle.setVehicleDescription(description);
	            if (imageUrl != null) vehicle.setVehiclePhotoUrl(imageUrl);

	            Vehicle updatedVehicle = vehicleRepository.save(vehicle);
	            VehicleDTO vehicleDTO = Utils.mapVehicleEntityToVehicleDTO(updatedVehicle);

	            response.setStatusCode(200);
	            response.setMessage("successful");
	            response.setVehicle(vehicleDTO);

	        } catch (CustomException e) {
	            response.setStatusCode(404);
	            response.setMessage(e.getMessage());
	        } catch (Exception e) {
	            response.setStatusCode(500);
	            response.setMessage("Error saving a vehicle " + e.getMessage());
	        }
	        return response;
	    }

	@Override
	public Response getVehicleById(Long vehicleId) {
		
		Response response = new Response();
		
		try {
			
			Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(() -> new CustomException("Vehicle not found"));
			VehicleDTO vehicleDTO = Utils.mapVehicleEntityToVehicleDTOPlusBookings(vehicle);
			
			response.setStatusCode(200);
			response.setMessage("Success");
			response.setVehicle(vehicleDTO);
			
		}catch(CustomException e) {
			response.setStatusCode(404);
			response.setMessage(e.getMessage());
			
		}
		catch (Exception e) {
			response.setStatusCode(500);
			response.setMessage("Error getting vehicle by id" + e.getMessage());
		}
		return response;
	}

	@Override
	public Response getAvailableVehiclesByDateAndTypes(LocalDate checkInDate, LocalDate checkOutDate,
			String vehicleType) {
		
		Response response = new Response();
		
		try {
			
			List<Vehicle> availableVehicles = vehicleRepository.findAvailableVehicleByDatesAndTypes(checkInDate, checkOutDate, vehicleType);
			List<VehicleDTO> vehicleDTOList = Utils.mapVehicleListEntityToVehicleListDTO(availableVehicles);
			
			
			response.setStatusCode(200);
			response.setMessage("Success");
			response.setVehicleList(vehicleDTOList);
			
		}catch (Exception e) {
			response.setStatusCode(500);
			response.setMessage("Error getting vehicle by available dates and types" + e.getMessage());
		}
		return response;
	}

	@Override
	public Response getAllAvailableVehicles() {
		
		Response response = new Response();
		
		try {
			
			List<Vehicle> vehicleList = vehicleRepository.getAllAvailableVehicles();
			List<VehicleDTO> vehicleDTOList = Utils.mapVehicleListEntityToVehicleListDTO(vehicleList);
			
			response.setStatusCode(200);
			response.setMessage("Success");
			response.setVehicleList(vehicleDTOList);
			
		}catch(CustomException e) {
			response.setStatusCode(404);
			response.setMessage(e.getMessage());
		}
		catch (Exception e) {
			response.setStatusCode(500);
			response.setMessage("Error getting all available vehicles" + e.getMessage());
		}
		return response;
	}

}

package com.booking.vehicleBooking.repo;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.booking.vehicleBooking.entity.Vehicle;

public interface VehicleRepository extends JpaRepository<Vehicle, Long>{
	
	@Query("SELECT DISTINCT v.vehicleType FROM Vehicle v")
	List<String> findDistinctVehicleTypes();
	
	//Find vehicle by date available and vehicle type
	@Query("SELECT v FROM Vehicle v WHERE v.vehicleType LIKE %:vehicleType% " +
		       "AND v.id NOT IN (" +
		       "SELECT bk.vehicle.id FROM Booking bk " +
		       "WHERE (bk.checkInDate <= :checkOutDate AND bk.checkOutDate >= :checkInDate))"
		)
	List<Vehicle> findAvailableVehicleByDatesAndTypes(LocalDate checkInDate, 
													  LocalDate checkOutDate,
													  String vehicleType);
	
	@Query("SELECT v FROM Vehicle v WHERE v.id NOT IN (SELECT b.vehicle.id FROM Booking b)")
	List<Vehicle> getAllAvailableVehicles();
}

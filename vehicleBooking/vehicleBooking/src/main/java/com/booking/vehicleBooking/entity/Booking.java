package com.booking.vehicleBooking.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
@Table(name = "bookings")
public class Booking {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotNull(message = "Check in date is required")
	private LocalDate checkInDate;
	
	
	@Future(message = "Check out date must be in the future")
	private LocalDate checkOutDate;
	
	@Min(value = 1, message = "Number of passenger must not be less than 1")
	private int numOfPassengers;
	
	@Min(value = 0, message = "Number of miles traveling must not be less than 0")
	private int numOfMiles;
	
	private String bookingConfirmationCode;
	
	@ManyToOne(fetch = FetchType.EAGER) //actively fetch user
	@JoinColumn(name = "user_id")
	private User user;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "vehicle_id")
	private Vehicle vehicle;

	@Override
	public String toString() {
		return "Booking [id=" + id + ", checkInDate=" + checkInDate + ", checkOutDate=" + checkOutDate
				+ ", numOfPassengers=" + numOfPassengers + ", numOfMiles=" + numOfMiles + ", bookingConfirmationCode="
				+ bookingConfirmationCode +  "," + "]";
	}
	
	
}

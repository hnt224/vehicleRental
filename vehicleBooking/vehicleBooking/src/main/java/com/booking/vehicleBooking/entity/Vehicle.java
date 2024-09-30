package com.booking.vehicleBooking.entity;



import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "vehicles")
public class Vehicle {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String vehicleType;
	private BigDecimal vehiclePrice;
	private String vehiclePhotoUrl;
	private String vehicleDescription;
	
	@OneToMany(mappedBy = "vehicle", fetch=FetchType.LAZY, cascade= CascadeType.ALL)
	private List<Booking> bookings = new ArrayList<>();
	
	@Override
	public String toString() {
		return "Vehicle [id=" + id + ", vehicleType=" + vehicleType + ", vehiclePrice=" + vehiclePrice
				+ ", vehiclePhotoUrl=" + vehiclePhotoUrl + ", vehicleDescription=" + vehicleDescription + ","  + "]";
	}
	
	
}

package com.booking.vehicleBooking.dto;



import java.math.BigDecimal;

import java.util.List;


import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VehicleDTO {
	private Long id;
	private String vehicleType;
	private BigDecimal vehiclePrice;
	private String vehiclePhotoUrl;
	private String vehicleDescription;
	private List<BookingDTO> bookings;
}

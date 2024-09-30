package com.booking.vehicleBooking.service.impl;

import java.io.InputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.booking.vehicleBooking.exception.CustomException;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.core.sync.RequestBody;

@Service
public class AwsS3Service {

    private final String bucketName = "vehicle-booking-images"; 

    @Value("${aws.s3.access.key}")
    private String awsS3accessKey; 

    @Value("${aws.s3.secret.key}")
    private String awsS3SecretKey; 

    public String saveImageToS3(MultipartFile photo) {
        try {
            // Get the S3 filename (photo name)
            String s3Filename = photo.getOriginalFilename();

            // Build AWS credentials
            AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(awsS3accessKey, awsS3SecretKey);

            // Build S3 client
            S3Client s3Client = S3Client.builder()
                    .region(Region.US_EAST_2)
                    .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                    .build();

            // Get the file input stream and metadata
            InputStream inputStream = photo.getInputStream();
            long contentLength = photo.getSize(); // file size
            String contentType = photo.getContentType(); // dynamic content type

            // Validate that the file is an image (optional but recommended)
            if (contentType == null || (!contentType.equals("image/jpeg") && 
                                        !contentType.equals("image/png") && 
                                        !contentType.equals("image/jpg"))) {
                throw new CustomException("Invalid file type. Only JPEG, JPG, and PNG are allowed.");
            }

            // Create the PutObjectRequest with dynamic content type
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Filename)
                    .contentType(contentType) // dynamic content type
                    .build();

            // Put object into the S3 bucket
            PutObjectResponse response = s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, contentLength));

            // Return the public URL of the uploaded image
            return "https://" + bucketName + ".s3.amazonaws.com/" + s3Filename;

        } catch (S3Exception e) {
            e.printStackTrace();
            throw new CustomException("Unable to upload image to S3 bucket: " + e.awsErrorDetails().errorMessage());
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException("Unable to upload image to S3 bucket");
        }
    }
}

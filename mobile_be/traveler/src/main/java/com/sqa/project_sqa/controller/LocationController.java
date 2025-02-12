package com.sqa.project_sqa.controller;

import com.sqa.project_sqa.repositories.LocationRepository;
import com.sqa.project_sqa.repositories.UserRepository;
import com.sqa.project_sqa.repositories.SearchLocation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sqa.project_sqa.entities.Location;
import com.sqa.project_sqa.entities.User;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@CrossOrigin
public class LocationController {
    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SearchLocation searchLocation;

    @Value("${openweathermap.apiKey}")
    private String openWeatherMapApiKey;

    @GetMapping("/api/v1/locations")
    public ResponseEntity<List<Location>> searchLocationsByName(@RequestParam(required = false, name = "keyword") String keyword) {
        try {
            List<Location> locations;
            if (keyword == null || keyword.isEmpty()) {
                locations = locationRepository.findAllOrderByRatingDesc().subList(0, 4);
            } else {
                locations = searchLocation.findAllByNameContainingKeyword(keyword);
            }

            if (locations.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(locations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/api/v1/locations/{id}")
    public ResponseEntity<Location> getLocationById(@PathVariable Long id) {
        Location location = locationRepository.findById(id).orElse(null);
        if (location == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(location, HttpStatus.OK);
    }

    @GetMapping("/api/v1/user/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/api/v1/weather/{locationId}")
    public ResponseEntity<?> getWeather(@PathVariable Long locationId) {
        try {
            // Lấy id_openweathermap từ locationId
            String weatherId = locationRepository.findWeatherIdByLocationId(locationId);

            // Thực hiện yêu cầu GET đến API OpenWeatherMap với id_openweathermap
            String apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + weatherId + "&appid=" + openWeatherMapApiKey+"&units=metric";
            RestTemplate restTemplate = new RestTemplate();
            String weatherData = restTemplate.getForObject(apiUrl, String.class);

            // Trả về dữ liệu thời tiết cho frontend
            return ResponseEntity.ok(weatherData);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching weather data");
        }
    }

}

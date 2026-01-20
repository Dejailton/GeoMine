package com.deloitte.GeoMine;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class GeoMineApplication {

	public static void main(String[] args) {
		//Bootcamp java da deloitte
		Dotenv dotenv = Dotenv.configure().filename(".env").load();
		dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));
		SpringApplication.run(GeoMineApplication.class, args);
	}

}
DROP TABLE IF EXISTS Half;
DROP TABLE IF EXISTS `Full`;
DROP TABLE IF EXISTS Refrigerator_Freezer;
DROP TABLE IF EXISTS Washer;
DROP TABLE IF EXISTS Dryer;
DROP TABLE IF EXISTS TV;
DROP TABLE IF EXISTS Oven_Heat_Source;
DROP TABLE IF EXISTS Oven;
DROP TABLE IF EXISTS Cooktop;
DROP TABLE IF EXISTS Cooker;
DROP TABLE IF EXISTS Phone_Number;
DROP TABLE IF EXISTS Household;
DROP TABLE IF EXISTS Location;
DROP TABLE IF EXISTS Manufacturer;

CREATE TABLE Location (
	postal_code varchar(5) NOT NULL, 
	state char(2) NOT NULL,
	city varchar(128) NOT NULL,
	longitude float NOT NULL,
	latitude float NOT NULL,
	
	PRIMARY KEY (postal_code), 
	UNIQUE KEY (postal_code)
);

CREATE TABLE Household (
	email varchar(250) NOT NULL,
	home_type varchar(250) NOT NULL,
	square_footage int NOT NULL,
	occupant_count int NOT NULL,
	bedroom_count int NOT NULL,
	postal_code char(5) NOT NULL,

	PRIMARY KEY (email), 
	UNIQUE KEY email (email),
	FOREIGN KEY (postal_code) REFERENCES Location(postal_code) 
);

CREATE TABLE Phone_Number (
	area_code char(3) NOT NULL,
	phone_number char(7) NOT NULL, 
	phone_type varchar(6) NOT NULL,
	email varchar(250) NOT NULL, 

	PRIMARY KEY (area_code, phone_number),
	FOREIGN KEY (email) REFERENCES Household(email) ON DELETE CASCADE
);

CREATE TABLE Manufacturer (
	manufacturer_name varchar(100) NOT NULL,
  
	PRIMARY KEY (manufacturer_name),
	UNIQUE KEY (manufacturer_name)
);

CREATE TABLE Refrigerator_Freezer (
	appliance_id int NOT NULL AUTO_INCREMENT,
	email varchar(250) NOT NULL,
	model_name varchar(100),
	refrigerator_type varchar(100) NOT NULL,
	manufacturer_name varchar(100) NOT NULL,

	PRIMARY KEY (appliance_id, email),
	UNIQUE KEY (appliance_id, email),
	FOREIGN KEY (email) REFERENCES Household(email) ON DELETE CASCADE,
	FOREIGN KEY (manufacturer_name) REFERENCES Manufacturer(manufacturer_name) ON DELETE CASCADE

);

CREATE TABLE Washer (
	appliance_id int NOT NULL AUTO_INCREMENT,
	email varchar(250) NOT NULL,
    model_name varchar(100),
    loading_type varchar(100) NOT NULL,
	manufacturer_name varchar(100) NOT NULL,

	PRIMARY KEY (appliance_id, email),
	UNIQUE KEY (appliance_id, email),
	FOREIGN KEY (email) REFERENCES Household(email) ON DELETE CASCADE,
	FOREIGN KEY (manufacturer_name) REFERENCES Manufacturer(manufacturer_name) ON DELETE CASCADE
    
);

CREATE TABLE Dryer (
	appliance_id int NOT NULL AUTO_INCREMENT,
	email varchar(250) NOT NULL,
    model_name varchar(100),
    heat_source varchar(100) NOT NULL,
	manufacturer_name varchar(100) NOT NULL,

	PRIMARY KEY (appliance_id, email),
	UNIQUE KEY (appliance_id, email),
	FOREIGN KEY (email) REFERENCES Household(email) ON DELETE CASCADE,
	FOREIGN KEY (manufacturer_name) REFERENCES Manufacturer(manufacturer_name) ON DELETE CASCADE
    
);

CREATE TABLE TV (
	appliance_id int NOT NULL AUTO_INCREMENT,
	email varchar(250) NOT NULL,
    model_name varchar(100),
    display_type varchar(100) NOT NULL,
    display_size double(10, 2) NOT NULL,
    max_resolution varchar(100) NOT NULL,
	manufacturer_name varchar(100) NOT NULL,

	PRIMARY KEY (appliance_id, email),
	UNIQUE KEY (appliance_id, email),
	FOREIGN KEY (email) REFERENCES Household(email) ON DELETE CASCADE,
	FOREIGN KEY (manufacturer_name) REFERENCES Manufacturer(manufacturer_name) ON DELETE CASCADE
    
);

CREATE TABLE Cooker (
	appliance_id int NOT NULL AUTO_INCREMENT,
	email varchar(250) NOT NULL,
    model_name varchar(100),
	manufacturer_name varchar(100) NOT NULL,

	PRIMARY KEY (appliance_id, email),
	UNIQUE KEY (appliance_id, email),
	FOREIGN KEY (email) REFERENCES Household(email) ON DELETE CASCADE,
	FOREIGN KEY (manufacturer_name) REFERENCES Manufacturer(manufacturer_name) ON DELETE CASCADE
    
);

CREATE TABLE Oven (
	appliance_id int NOT NULL,
	email varchar(250) NOT NULL,
	oven_type varchar(100) NOT NULL,

	PRIMARY KEY (appliance_id, email),
	UNIQUE KEY (appliance_id, email),
	FOREIGN KEY (appliance_id) REFERENCES Cooker(appliance_id) ON DELETE CASCADE
    
);

CREATE TABLE Oven_Heat_Source (
	appliance_id int NOT NULL,
	email varchar(250) NOT NULL,
	heat_source varchar(100) NOT NULL,

	PRIMARY KEY (appliance_id, email, heat_source),
	UNIQUE KEY (appliance_id, email, heat_source),
	FOREIGN KEY (appliance_id, email) REFERENCES Oven(appliance_id, email) ON DELETE CASCADE
    
);

CREATE TABLE Cooktop (
	appliance_id int NOT NULL,
	email varchar(250) NOT NULL,
	heat_source varchar(100) NOT NULL,

	PRIMARY KEY (appliance_id, email),
	UNIQUE KEY (appliance_id, email),
	FOREIGN KEY (appliance_id) REFERENCES Cooker(appliance_id) ON DELETE CASCADE
    
);


CREATE TABLE `Full` (
	bathroom_id int NOT NULL AUTO_INCREMENT, 
	email varchar(250) NOT NULL, 
  
	sink_count int NOT NULL,
	bidet_count int NOT NULL,
	commode_count int NOT NULL,
	is_primary tinyint NOT NULL, 
	bathtub_count int NOT NULL,
  	shower_count int NOT NULL,
  	tub_shower_count int NOT NULL,


  	PRIMARY KEY (bathroom_id, email),
	UNIQUE KEY (bathroom_id, email),
  	FOREIGN KEY (email) REFERENCES Household(email)  ON DELETE CASCADE
);

CREATE TABLE Half (
	bathroom_id int NOT NULL AUTO_INCREMENT,
	email varchar(250) NOT NULL, 
  
	sink_count int NOT NULL,
	bidet_count int NOT NULL,
  	commode_count int NOT NULL,
  	`name` varchar(100),


	PRIMARY KEY (bathroom_id, email),
	UNIQUE KEY (bathroom_id, email),
  	FOREIGN KEY (email) REFERENCES Household(email) ON DELETE CASCADE
);


# 🏢 Employee Management System (EMS)

A simple **full-stack** Employee Management System built with:
- **Backend:** Spring Boot (Java, Maven, REST API)
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Database:** MySQL (JPA/Hibernate)

This project allows you to **Create, Read, Update, and Delete (CRUD)** employee records with a clean UI and animations.

---

## ✨ Features
✅ Add new employees  
✅ View all employees  
✅ Update employee details  
✅ Delete employees  
✅ Responsive UI with CSS animations  
✅ RESTful API with Spring Boot  
✅ MySQL database integration  

---

## 📂 Project Structure

```
ems-backend/
│
├── src/main/java/net/javaguides/ems/
│   ├── controller/        # REST Controllers
│   ├── dto/               # Data Transfer Objects
│   ├── entity/            # JPA Entities
│   ├── exception/         # Custom Exceptions
│   ├── mapper/            # Entity <-> DTO Mapping
│   ├── repository/        # Spring Data JPA Repositories
│   ├── service/           # Service Interfaces
│   └── service/impl       # Service Implementations
│
└── src/main/resources/    # Application properties, static files, templates
```

---

## 🚀 Getting Started

### 1️⃣ Prerequisites
- Java 17+
- Maven
- MySQL
- Node.js (optional, if using advanced frontend tooling)

### 2️⃣ Backend Setup
```bash
# Navigate to backend folder
cd ems-backend

# Update MySQL credentials in src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/ems_db
spring.datasource.username=root
spring.datasource.password=yourpassword

# Run the Spring Boot app
mvn spring-boot:run
```

### 3️⃣ Frontend Setup
```bash
# Open index.html in your browser or use Live Server extension in VS Code
```

---

## 📡 API Endpoints

| Method | Endpoint               | Description        |
|--------|------------------------|--------------------|
| POST   | `/api/employees`       | Create employee    |
| GET    | `/api/employees`       | Get all employees  |
| GET    | `/api/employees/{id}`  | Get employee by ID |
| PUT    | `/api/employees/{id}`  | Update employee    |
| DELETE | `/api/employees/{id}`  | Delete employee    |

---

## 📸 Screenshots

![Employee List UI](screenshots/employee_list.png)
![Add Employee Form](screenshots/add_employee.png)

---

## 📜 License
This project is licensed under the MIT License.

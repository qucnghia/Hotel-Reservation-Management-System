package com.hotel.core.model.person;

public class Employee extends Person {
    private String employeeId;
    private String role;
    private double salary;

    public Employee() {
    }

    public Employee(String id, String fullName, String phone, String email, String employeeId, String role, double salary) {
        super(id, fullName, phone, email);
        this.employeeId = employeeId;
        this.role = role;
        this.salary = salary;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }
}

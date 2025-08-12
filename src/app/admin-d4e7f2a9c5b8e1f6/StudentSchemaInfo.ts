const StudentSchemaInfo = {
  title: "Student Upload",
  columns: ["applicationId", "name", "email", "phone", "department"],
  sampleRow: [
    "APP001",
    "John Doe",
    "john.doe@example.com",
    "9876543210",
    "SOT",
  ],
  columnDescriptions: [
    { key: "applicationId", description: "Unique application identifier" },
    { key: "name", description: "Student's full name" },
    { key: "email", description: "Valid email address" },
    { key: "phone", description: "Contact phone number (10 digits)" },
    {
      key: "department",
      description: "Department name (Case Sensitive in uppercase)",
    },
  ],
  guidelines: [
    "Column headers must match exactly (case sensitive)",
    "All fields are required",
    "Department should be in uppercase (SOT, SOM, SOH)",
    "Application ID must be unique",
    "Email must be in valid format",
    "Phone number should be 10 digits",
  ],
  commonIssues: [
    "Wrong column names (case sensitive)",
    "Missing required fields",
    "Incorrect department format (must be uppercase)",
    "Duplicate application IDs",
    "Duplicate email addresses",
    "Invalid email format",
    "Phone number not 10 digits",
    "Department not in uppercase",
  ],
  downloadLink:
    "https://docs.google.com/spreadsheets/d/1Iy_3cCzlUna7JJ3d4dErhdq2P9O2jP0wcQ966Y8E57U/export?format=xlsx",
};

export default StudentSchemaInfo;

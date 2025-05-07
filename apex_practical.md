Here's a simple example of a **Salesforce Apex application** that could be used for a **lab practical**. This app manages a list of **Student** records with basic operations like creating, updating, and retrieving student data.

---

### 🔧 **1. Custom Object: `Student__c`**

First, create a custom object in Salesforce named `Student__c` with the following custom fields:

| Field Label | Field Name  | Data Type                     |
| ----------- | ----------- | ----------------------------- |
| Name        | Name        | Text                          |
| Email       | Email\_\_c  | Email                         |
| Age         | Age\_\_c    | Number(3,0)                   |
| Course      | Course\_\_c | Picklist (e.g. BSc, MSc, PhD) |

---

### 📜 **2. Apex Class: StudentManager**

```apex
public class StudentManager {

    // Method to add a new student
    public static void addStudent(String name, String email, Integer age, String course) {
        Student__c s = new Student__c(
            Name = name,
            Email__c = email,
            Age__c = age,
            Course__c = course
        );
        insert s;
    }

    // Method to update student email
    public static void updateStudentEmail(Id studentId, String newEmail) {
        Student__c s = [SELECT Id, Email__c FROM Student__c WHERE Id = :studentId];
        s.Email__c = newEmail;
        update s;
    }

    // Method to retrieve students enrolled in a specific course
    public static List<Student__c> getStudentsByCourse(String course) {
        return [SELECT Name, Email__c, Age__c, Course__c FROM Student__c WHERE Course__c = :course];
    }

    // Method to delete a student
    public static void deleteStudent(Id studentId) {
        Student__c s = [SELECT Id FROM Student__c WHERE Id = :studentId];
        delete s;
    }
}
```

---

### ✅ **3. Test Class: StudentManagerTest**

```apex
@isTest
public class StudentManagerTest {

    @isTest
    static void testAddAndRetrieveStudent() {
        StudentManager.addStudent('Alice', 'alice@example.com', 22, 'MSc');
        List<Student__c> students = StudentManager.getStudentsByCourse('MSc');
        System.assertEquals(1, students.size());
        System.assertEquals('Alice', students[0].Name);
    }

    @isTest
    static void testUpdateEmail() {
        Student__c s = new Student__c(Name='Bob', Email__c='bob@example.com', Age__c=23, Course__c='BSc');
        insert s;
        StudentManager.updateStudentEmail(s.Id, 'bob.new@example.com');
        Student__c updated = [SELECT Email__c FROM Student__c WHERE Id = :s.Id];
        System.assertEquals('bob.new@example.com', updated.Email__c);
    }

    @isTest
    static void testDeleteStudent() {
        Student__c s = new Student__c(Name='Charlie', Email__c='charlie@example.com', Age__c=24, Course__c='PhD');
        insert s;
        StudentManager.deleteStudent(s.Id);
        List<Student__c> deleted = [SELECT Id FROM Student__c WHERE Id = :s.Id];
        System.assertEquals(0, deleted.size());
    }
}
```

---

This example covers:

* DML operations (`insert`, `update`, `delete`)
* SOQL queries
* Apex test methods

Would you like a Visualforce page or Lightning component to go along with this?

To make the provided Apex code work from start to finish in your Salesforce org, follow these **step-by-step instructions**:

---

## ✅ Step 1: Create the Custom Field

### Add `Stage_Progress__c` to the Account object

1. Go to **Setup** → **Object Manager** → **Account**.
2. Select **Fields & Relationships**, click **New**.
3. Choose **Percent** as the data type.
4. Field Label: `Stage Progress`

   * Field Name (API): `Stage_Progress__c`
   * Length: 3
   * Decimal Places: 2
5. Click **Next**, assign to layouts, and **Save**.

---

## ✅ Step 2: Create the Apex Class

1. Go to **Setup** → **Apex Classes** → click **New**.
2. Paste the following code:

```apex
public class AccountStageProgressCalculator {

    private static final Map<String, Decimal> stageProgressMap = new Map<String, Decimal>{
        'Prospecting' => 25,
        'Qualification' => 30,
        'Needs Analysis' => 35,
        'Value Proposition' => 40,
        'Proposal/Price Quote' => 45,
        'Negotiation/Review' => 50,
        'Closed Won' => 100,
        'Closed Lost' => 0
    };

    public static void calculateStageProgress(Set<Id> accountIds) {
        Map<Id, List<Opportunity>> oppsByAccount = new Map<Id, List<Opportunity>>();
        for (Opportunity opp : [
            SELECT Id, AccountId, StageName
            FROM Opportunity
            WHERE AccountId IN :accountIds
        ]) {
            if (!oppsByAccount.containsKey(opp.AccountId)) {
                oppsByAccount.put(opp.AccountId, new List<Opportunity>());
            }
            oppsByAccount.get(opp.AccountId).add(opp);
        }

        List<Account> accountsToUpdate = new List<Account>();

        for (Id accountId : oppsByAccount.keySet()) {
            List<Opportunity> opps = oppsByAccount.get(accountId);
            Decimal total = 0;
            Integer count = 0;

            for (Opportunity opp : opps) {
                if (stageProgressMap.containsKey(opp.StageName)) {
                    total += stageProgressMap.get(opp.StageName);
                    count++;
                }
            }

            Decimal avgProgress = (count > 0) ? total / count : 0;
            accountsToUpdate.add(new Account(
                Id = accountId,
                Stage_Progress__c = avgProgress
            ));
        }

        if (!accountsToUpdate.isEmpty()) {
            update accountsToUpdate;
        }
    }
}
```

3. Click **Save**.

---

## ✅ Step 3: Run the Code (Manual Test)

To test it manually in the Developer Console:

1. Open **Developer Console** → **Debug** → **Open Execute Anonymous Window**.
2. Enter this code (replace with real Account Ids if you know them):

```apex
Set<Id> accountIds = new Set<Id>{
    '001XXXXXXXXXXXX', '001YYYYYYYYYYYY'  // Replace with valid Account Ids
};
AccountStageProgressCalculator.calculateStageProgress(accountIds);
```

3. Check **Open Log**, then click **Execute**.

---

## ✅ Step 4: Automate with Trigger (Optional)

To automatically update progress when Opportunities are updated:

1. Go to **Apex Triggers** → click **New Trigger** on the **Opportunity** object.
2. Use this code:

```apex
trigger OpportunityTrigger on Opportunity (after insert, after update, after delete, after undelete) {
    Set<Id> accountIds = new Set<Id>();

    if (Trigger.isInsert || Trigger.isUpdate || Trigger.isUndelete) {
        for (Opportunity opp : Trigger.new) {
            if (opp.AccountId != null) {
                accountIds.add(opp.AccountId);
            }
        }
    }

    if (Trigger.isDelete) {
        for (Opportunity opp : Trigger.old) {
            if (opp.AccountId != null) {
                accountIds.add(opp.AccountId);
            }
        }
    }

    if (!accountIds.isEmpty()) {
        AccountStageProgressCalculator.calculateStageProgress(accountIds);
    }
}
```

3. Click **Save**.

---

## ✅ Step 5: Test it!

* Create or update Opportunities under an Account.
* Check the Account's `Stage Progress` field after saving.

---

Absolutely! Let's walk through building a **Contact-Opportunity Mapper** in Salesforce. This tool will relate Contacts to Opportunities based on certain logic—like shared Account, custom lookup fields, or even a junction object—depending on your use case.

---

## 🎯 Goal:

Create a way to **link Contacts to Opportunities**, and track this relationship (e.g., for B2B decision-maker mapping, sales involvement, etc.).

---

# ✅ Step-by-Step Guide: Contact-Opportunity Mapper

---

## 🔧 **Step 1: Choose a Relationship Type**

### Option A: Use a **custom junction object** (most flexible & scalable)

We'll create a new object: `Contact_Opportunity__c`

---

## ✅ Step 2: Create the Custom Object

1. Go to **Setup** → **Object Manager** → **Create → Custom Object**.
2. Name: `Contact Opportunity`

   * Plural: `Contact Opportunities`
   * API Name: `Contact_Opportunity__c`
3. Enable:

   * `Allow Reports`
   * `Track Field History`
   * `Allow Activities`
4. Click **Save**.

---

## ✅ Step 3: Add Lookup Fields to the Custom Object

1. Inside `Contact Opportunity` object → click **Fields & Relationships** → **New Field**.
2. Add a **Lookup Relationship** to:

   * `Contact`
   * Then another one to `Opportunity`

You now have two fields:

* `Contact__c` (Lookup to Contact)
* `Opportunity__c` (Lookup to Opportunity)

These connect a Contact to an Opportunity.

---

## ✅ Step 4: Create Apex Mapper Class

Go to **Setup** → **Apex Classes** → **New**, and paste:

```apex
public class ContactOpportunityMapper {

    public static void mapContactsToOpportunities(Set<Id> opportunityIds) {
        // Step 1: Fetch Opportunities and related Contacts via Account
        List<Opportunity> opps = [
            SELECT Id, AccountId
            FROM Opportunity
            WHERE Id IN :opportunityIds
        ];

        Set<Id> accountIds = new Set<Id>();
        for (Opportunity opp : opps) {
            if (opp.AccountId != null) {
                accountIds.add(opp.AccountId);
            }
        }

        // Step 2: Get Contacts related to these Accounts
        Map<Id, List<Contact>> contactsByAccount = new Map<Id, List<Contact>>();
        for (Contact c : [
            SELECT Id, AccountId
            FROM Contact
            WHERE AccountId IN :accountIds
        ]) {
            if (!contactsByAccount.containsKey(c.AccountId)) {
                contactsByAccount.put(c.AccountId, new List<Contact>());
            }
            contactsByAccount.get(c.AccountId).add(c);
        }

        // Step 3: Create junction records (Contact_Opportunity__c)
        List<Contact_Opportunity__c> junctionsToCreate = new List<Contact_Opportunity__c>();

        for (Opportunity opp : opps) {
            List<Contact> relatedContacts = contactsByAccount.get(opp.AccountId);
            if (relatedContacts != null) {
                for (Contact c : relatedContacts) {
                    junctionsToCreate.add(new Contact_Opportunity__c(
                        Contact__c = c.Id,
                        Opportunity__c = opp.Id
                    ));
                }
            }
        }

        if (!junctionsToCreate.isEmpty()) {
            insert junctionsToCreate;
        }
    }
}
```

---

## ✅ Step 5: Optional Trigger on Opportunity (Auto-Mapping)

If you want to map Contacts automatically when an Opportunity is created:

1. Go to **Object Manager** → **Opportunity** → **Triggers** → **New**.
2. Add:

```apex
trigger MapContactsToOpportunity on Opportunity (after insert) {
    Set<Id> opportunityIds = new Set<Id>();
    for (Opportunity opp : Trigger.new) {
        opportunityIds.add(opp.Id);
    }

    ContactOpportunityMapper.mapContactsToOpportunities(opportunityIds);
}
```

---

## ✅ Step 6: Test It Out!

1. Create a **Contact** under an **Account**.
2. Create an **Opportunity** under the same Account.
3. After saving the Opportunity:

   * Go to the **Contact Opportunity** custom object tab (create a tab if needed).
   * You should see a record linking that Contact and Opportunity.

---

## 🚀 Bonus: Reporting & Visibility

* Add related lists to **Opportunity** and **Contact** layouts for `Contact Opportunities`.
* Create reports like “Contacts Involved in Opportunities.”

---

Would you like help writing test classes for this Apex logic, or want the mapper to only connect Contacts with specific roles or conditions?


Here’s how you can write an Apex method to **generate a custom report** for all `Opportunity` records with **Probability > 50%**, **ordered by CloseDate**, and **return it as a formatted string**.

---

## ✅ Apex Method: Custom Opportunity Report

```apex
public class OpportunityReportGenerator {

    public static String generateHighProbabilityReport() {
        // Step 1: Query Opportunities with Probability > 50%, ordered by CloseDate
        List<Opportunity> highProbOpps = [
            SELECT Name, CloseDate, StageName, Amount, Probability
            FROM Opportunity
            WHERE Probability > 50
            ORDER BY CloseDate ASC
        ];

        // Step 2: Format Header
        String report = 'Opportunity Report - Probability > 50%\n';
        report += '---------------------------------------------------\n';
        report += 'Name\t\tClose Date\tStage\t\tAmount\tProbability\n';
        report += '---------------------------------------------------\n';

        // Step 3: Format Each Row
        for (Opportunity opp : highProbOpps) {
            String row = String.format(
                '{0}\t{1}\t{2}\t{3}\t{4}%',
                new List<String>{
                    opp.Name,
                    String.valueOf(opp.CloseDate),
                    opp.StageName,
                    (opp.Amount != null) ? String.valueOf(opp.Amount.setScale(2)) : '0.00',
                    String.valueOf(opp.Probability.intValue())
                }
            );
            report += row + '\n';
        }

        // Step 4: Return Report
        return report;
    }
}
```

---

### 🧪 How to Run:

You can test this in the **Developer Console**:

```apex
String output = OpportunityReportGenerator.generateHighProbabilityReport();
System.debug(output);
```

Or return the string as part of a Visualforce page or email body.

---

### 📄 Example Output:

```
Opportunity Report - Probability > 50%
---------------------------------------------------
Name            Close Date     Stage       Amount  Probability
---------------------------------------------------
Big Deal A      2025-05-20     Proposal    5000.00 75%
Next Step Co    2025-06-01     Negotiation 8000.00 60%
```

---

Would you like this report emailed, exported as CSV, or shown on a Visualforce/LWC page?

Creating a **basic calculator in Apex** is a great way to understand Apex logic and control structures. Below is a simple Apex class that performs **addition, subtraction, multiplication, and division** based on user input.

---

## ✅ Apex Calculator Class

```apex
public class ApexCalculator {

    public static Decimal calculate(Decimal a, Decimal b, String operation) {
        Decimal result;

        switch on operation.toLowerCase() {
            when 'add' {
                result = a + b;
            }
            when 'subtract' {
                result = a - b;
            }
            when 'multiply' {
                result = a * b;
            }
            when 'divide' {
                if (b != 0) {
                    result = a / b;
                } else {
                    throw new ArithmeticException('Cannot divide by zero.');
                }
            }
            when else {
                throw new IllegalArgumentException('Unsupported operation: ' + operation);
            }
        }

        return result;
    }
}
```

---

## 🧪 How to Test It (in Developer Console):

```apex
Decimal resultAdd = ApexCalculator.calculate(10, 5, 'add');
Decimal resultSub = ApexCalculator.calculate(10, 5, 'subtract');
Decimal resultMul = ApexCalculator.calculate(10, 5, 'multiply');
Decimal resultDiv = ApexCalculator.calculate(10, 5, 'divide');

System.debug('Add: ' + resultAdd);
System.debug('Subtract: ' + resultSub);
System.debug('Multiply: ' + resultMul);
System.debug('Divide: ' + resultDiv);
```

---

## 🧠 Output:

```
Add: 15
Subtract: 5
Multiply: 50
Divide: 2
```

---

Would you like this calculator to support more operations like modulus or power, or to be used in a Visualforce or LWC UI?


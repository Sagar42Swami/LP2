import re

# Define the knowledge base as a set of rules.
# Each rule is a tuple: (condition, action)
# The condition is a dictionary of attribute-value pairs.
# The action is a dictionary specifying what to do.
KNOWLEDGE_BASE = [
    # Rule 1: Problem with network connectivity
    (
        {"problem": "network"},
        {"action": "troubleshoot_network"}
    ),
    # Rule 2: Problem with email access
    (
        {"problem": "email"},
        {"action": "troubleshoot_email"}
    ),
    # Rule 3: Problem with software installation
    (
        {"problem": "software"},
        {"action": "troubleshoot_software"}
    ),
    # Rule 4:  Password reset request
    (
        {"problem": "password"},
        {"action": "reset_password"}
    ),
    # Rule 5:  Hardware malfunction
    (
        {"problem": "hardware"},
        {"action": "troubleshoot_hardware"}
    ),
    # Rule 6:  Printer problem
    (
        {"problem": "printer"},
        {"action": "troubleshoot_printer"}
    ),
     # Rule 7:  Slow computer
    (
        {"problem": "slow computer"},
        {"action": "troubleshoot_slow_computer"}
    ),
    # Rule 8:  Cannot access website
    (
        {"problem": "website access"},
        {"action": "troubleshoot_website_access"}
    ),
    # Rule 9:  File recovery
    (
        {"problem": "file recovery"},
        {"action": "troubleshoot_file_recovery"}
    ),
    # Rule 10: System crash
    (
        {"problem": "system crash"},
        {"action": "troubleshoot_system_crash"}
    ),
]

def forward_chaining(facts):
    """
    Performs forward chaining to infer actions based on given facts.

    Args:
        facts (dict): A dictionary of known facts (e.g., {"problem": "network"}).

    Returns:
        dict: The action to be taken, or None if no matching rule is found.
    """
    for condition, action in KNOWLEDGE_BASE:
        # Check if the condition part of the rule matches the given facts
        match = True
        for key, value in condition.items():
            if key not in facts or facts[key] != value:
                match = False
                break  # If any part of the condition doesn't match, move to the next rule
        if match:
            return action  # If all parts of the condition match, return the action
    return None  # If no rule matches the facts, return None

def get_user_input():
    """
    Gets user input about the help desk problem.  Added input validation.
    """
    valid_problems = ["network", "email", "software", "password", "hardware", "printer",
                      "slow computer", "website access", "file recovery", "system crash"]
    while True:
        print("Please describe your problem.  Choose from the following categories:")
        print(", ".join(valid_problems))
        problem = input("Problem: ").lower()
        if problem in valid_problems:
            return {"problem": problem}
        else:
            print("Invalid problem category.  Please choose from the list.")

def handle_action(action):
    """
    Performs the action recommended by the expert system.
    This function simulates the help desk actions.

    Args:
        action (dict): The action to be taken (returned by forward_chaining).
    """
    if action is None:
        print("I could not identify the problem. Please provide more details or contact a human agent.")
        return

    action_name = action["action"]  # Extract the action name

    if action_name == "troubleshoot_network":
        print("Troubleshooting Network Connectivity:")
        print("1. Check your network cable connection.")
        print("2. Restart your router and modem.")
        print("3. Try connecting to a different network.")
        print("4. Contact your internet service provider.")
    elif action_name == "troubleshoot_email":
        print("Troubleshooting Email Access:")
        print("1. Check your internet connection.")
        print("2. Verify your email address and password.")
        print("3. Check your email server settings.")
        print("4. Contact your email provider.")
    elif action_name == "troubleshoot_software":
        print("Troubleshooting Software Installation:")
        print("1. Ensure your system meets the minimum requirements.")
        print("2. Download the latest version of the software.")
        print("3. Check for conflicting software.")
        print("4. Run the installer as administrator.")
    elif action_name == "reset_password":
        print("Resetting Password:")
        print("1. Go to the password reset page on our website.")
        print("2. Enter your username or email address.")
        print("3. Follow the instructions to create a new password.")
    elif action_name == "troubleshoot_hardware":
        print("Troubleshooting Hardware Malfunction:")
        print("1. Identify the faulty hardware component.")
        print("2. Check power connections and cables.")
        print("3. Restart your computer.")
        print("4. Contact technical support for repair or replacement.")
    elif action_name == "troubleshoot_printer":
        print("Troubleshooting Printer Problem:")
        print("1. Check if the printer is turned on and connected.")
        print("2. Verify that the printer has paper and ink/toner.")
        print("3. Restart the printer and your computer.")
        print("4. Check for any error messages on the printer display.")
    elif action_name == "troubleshoot_slow_computer":
        print("Troubleshooting Slow Computer:")
        print("1. Close unnecessary programs and browser tabs.")
        print("2. Run a virus scan.")
        print("3. Check your hard drive space.")
        print("4. Defragment your hard drive (for traditional hard drives).")
    elif action_name == "troubleshoot_website_access":
        print("Troubleshooting Website Access:")
        print("1. Check your internet connection.")
        print("2. Clear your browser's cache and cookies.")
        print("3. Try a different browser.")
        print("4. Check if the website is down for everyone.")
    elif action_name == "troubleshoot_file_recovery":
        print("Troubleshooting File Recovery:")
        print("1. Check the Recycle Bin or Trash folder.")
        print("2. Use file recovery software.")
        print("3. Check your backups.")
        print("4. Contact data recovery services if the data is critical.")
    elif action_name == "troubleshoot_system_crash":
        print("Troubleshooting System Crash:")
        print("1. Restart your computer.")
        print("2. Check for recent software or hardware changes.")
        print("3. Run a system file checker.")
        print("4. Consider restoring your system to a previous state.")
    else:
        print("I don't know how to handle that action.  This is a placeholder.") #Should not reach here

def main():
    """
    Main function to run the expert system.
    """
    print("Welcome to the Help Desk Expert System!")
    print("I can help you with common technical problems.")

    facts = get_user_input()  # Get user input as facts
    action = forward_chaining(facts)  # Infer action using forward chaining
    handle_action(action)  # Perform the recommended action

if __name__ == "__main__":
    main()

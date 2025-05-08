import re
import random

def get_response(user_input):
    """
    Generates a response to the user's input.  This is the core of the chatbot's logic.

    Args:
        user_input (str): The text input from the user.

    Returns:
        str: The chatbot's response to the user.
    """
    # Convert user input to lowercase for easier matching
    user_input = user_input.lower()

    # Remove any leading/trailing whitespace
    user_input = user_input.strip()

    # Remove punctuation (except for apostrophes)
    user_input = re.sub(r"[^\w\s']", '', user_input)

    # Split the input into a list of words
    words = user_input.split()

    # Define a dictionary of possible responses based on keywords
    response_patterns = {
        r".*hello.*": [
            "Hello! How can I assist you today?",
            "Hi there! What can I do for you?",
            "Greetings! How may I help?"
        ],
        r".*goodbye.*": [
            "Goodbye! Have a great day!",
            "Bye! Feel free to reach out again if you need anything.",
            "Farewell!"
        ],
        r".*thank you.*": [
            "You're welcome!",
            "No problem!",
            "Happy to help!"
        ],
        r".*order status.*": [
            "To check your order status, please provide your order number.",
            "Can I get your order number to look that up for you?",
            "Please provide your order number."
        ],
        r".*order number (\d+).*": [  # Using a capture group to extract the number
            "Okay, I'm checking the status of order number {}.  It is currently being processed.",
            "Order number {} is being shipped to you.",
            "I found order number {}.  It was delivered on [some date]."
        ],
        r".*track order (\d+).*": [ #order tracking
            "Your order number {} is currently in transit.",
            "I am looking up the tracking information for order number {}.",
            "To track your order, please visit our website and enter {}."
        ],
        r".*delivery.*": [
            "Our standard delivery time is 3-5 business days.",
            "Delivery usually takes between 3 and 7 days.",
            "For expedited shipping, it's 1-2 business days."
        ],
        r".*return policy.*": [
            "Our return policy allows returns within 30 days of purchase.",
            "You can return items within 30 days for a full refund.",
            "Please see our website for details on our return policy."
        ],
        r".*contact.*": [
            "You can contact us via email at support@example.com or by phone at 123-456-7890.",
            "Our customer service email is support@example.com.  You can also call us.",
            "Reach out to us at support@example.com or call 123-456-7890."
        ],
        r".*help.*": [
            "I can help you with order status, delivery information, returns, and contact information.",
            "How can I help you today?",
            "What information are you looking for?"
        ],
        r".*cancel order (\d+).*": [
            "I can cancel order number {}.  Are you sure you want to cancel it?",
            "Order number {} can be cancelled. Please confirm your cancellation.",
            "To cancel order {}, I will need your confirmation."
        ],
        r".*yes.*cancel order (\d+).*": [
            "Your order number {} has been cancelled.",
            "Order {} is now cancelled.",
            "I have cancelled order {}."
        ],
        r".*no.*cancel order (\d+).*": [
            "Okay, I have not cancelled order number {}.",
            "Order {} cancellation aborted.",
            "I will proceed with order {}."
        ],
        r".*change address.*order (\d+).*": [
            "To change the address for order {}, please provide the new address.",
            "Please provide the new address for order {}.",
            "I can help change the address for order {}. What is the new address?"
        ],
        r".*new address for order (\d+) is (.*).*": [
            "The address for order {} has been changed to {}.",
            "I've updated the address for order {} to {}.",
            "Okay, order {} will be shipped to {}."
        ],
        r".*default.*": [
            "I am a basic chatbot designed to answer common customer service questions.",
            "I am a simple chatbot.",
            "I am here to assist you."
        ],
    }

    # Check for a match in the response patterns
    for pattern, responses in response_patterns.items():
        match = re.search(pattern, user_input)
        if match:
            # If there's a match, extract any captured groups (e.g., order number)
            format_args = match.groups()
            # Choose a random response from the list of possible responses
            response = random.choice(responses)
            # Format the response with the captured groups, if any
            if format_args:
                return response.format(*format_args)
            else:
                return response

    # Default response if no pattern matches
    return "I'm sorry, I don't understand.  Could you please rephrase your question?"

def main():
    """
    Main function to run the chatbot.  This function handles the interaction loop
    with the user.
    """
    print("Welcome to our Customer Service Chatbot!")
    print("Type 'goodbye' to exit.")

    while True:
        user_input = input("You: ")
        response = get_response(user_input)
        print("Chatbot:", response)
        if "goodbye" in response.lower():
            break

if __name__ == "__main__":
    main()


def calculate_area(length, width):
    if (isinstance(length, int) or isinstance(length, float)) and (isinstance(width, int) or isinstance(width, float)):
        return length * width
    else:
        return f"Invalid input: '{length}, {width} \n'"

print(calculate_area(5, 1))
print(calculate_area(4, 3))
print(calculate_area(2, 3))

exit = 1

app = "b@nk"

accounts = []

class BankAccount:
    def __init__(self, name):
        self.id = len(accounts) + 1
        self.name = name
        self.balance = 0.0

        def deposit(amount):
            if isinstance(amount, float):
                self.balance = self.balance + amount
                return f"Deposit of {amount} succesful.\n"
            else:
                return f"Invalid input: {amount} \n"
        def withdrawal(amount):
            if isinstance(amount, float):
                if amount <= self.balance:
                    self.balance = self.balance - amount
                else:
                    return f"Insufficient funds! \n \n Requested amount: {amount} \n Balance: {self.balance}"
            else:
                return f"Invalid input: {amount} \n"
        def get_balance():
            return self.balance
        
commands = {
    "help":"shows this list.",


}

def bnk():
    global exit
    while exit == 1:
        print("Enter 'h' or \"help\" to see command list.")
        inp = input(f"{app}: ")
        if inp == 'h' or "help":
            for i in commands

            
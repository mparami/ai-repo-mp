print("Hello World")

tekst = "Hallo"
getal = 5
kommagetal = 3.14

print(tekst)
print(getal)
print(kommagetal)

naam = input("Wat is u naam? \n")
leeftijd = input("Hoe oud bent u? \n")

print(f"Hallo {naam}! U bent {leeftijd} jaar oud. ")

getal1 = 8
getal2 = 4

print(getal1 + getal2)
print(getal1 - getal2)
print(getal1 * getal2)
print(getal1 / getal2)

boeken = ["De Hobbit", "1984", "To Kill A Mockingbird"]
print(boeken)

boeken.append("Pride and Prejudice")
print(boeken)

leeftijd = int(input("Hoe oud bent u nu?"))

if leeftijd >= 18:
    print("U bent oud genoeg om te stemmen.")
else:
    print("U bent niet oud genoed om te stemmen.")

for i in range(1, 11):
    print(i)

def hallo():
    print("Hello World")

hallo()
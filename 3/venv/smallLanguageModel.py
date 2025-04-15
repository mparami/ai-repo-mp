isRunning = True

keywords = {
    "Piet Mondriaan": "Piet Mondriaan was een Nederlandse schilder en pionier van de abstracte kunst.",
    "Grace Hopper": "Grace Hopper was a pioneering computer scientist and U.S. Navy rear admiral, best known for her groundbreaking work in developing computer programming languages. She played a key role in the creation of COBOL (Common Business-Oriented Language), which became one of the most widely used programming languages for business applications.",
    "Windows 95": "Windows 95, released in 1995, was a groundbreaking operating system by Microsoft. It introduced the iconic Start Menu, Plug and Play hardware support, and 32-bit multitasking, making computers faster and easier to use. It also integrated Internet Explorer and modernized the user interface, setting the stage for the dominance of Windows in personal computing. It’s remembered for its improved performance, ease of use, and its famous marketing campaign with \"Start Me Up\" by The Rolling Stones.",
    "IBM 701": "The IBM 701, released in 1952, was IBM’s first commercially successful computer. It was designed for scientific and engineering calculations and used vacuum tubes for processing. With a 50-bit word size and core memory for storing data, it was a significant advancement in computing at the time. The IBM 701 laid the foundation for IBM’s future dominance in the computing industry, particularly in commercial and military applications."
}


def levenshtein_distance(str1, str2):
    len_str1, len_str2 = len(str1), len(str2)
    dp = [[0] * (len_str2 + 1) for _ in range(len_str1 + 1)]

    for i in range(len_str1 + 1):
        dp[i][0] = i
    for j in range(len_str2 + 1):
        dp[0][j] = j

    for i in range(1, len_str1 + 1):
        for j in range(1, len_str2 + 1):
            cost = 0 if str1[i - 1] == str2[j - 1] else 1
            dp[i][j] = min(dp[i - 1][j] + 1,      # Deletion
                           dp[i][j - 1] + 1,      # Insertion
                           dp[i - 1][j - 1] + cost) # Substitution
    return dp[len_str1][len_str2]

def find_exact_match(question):
    for keyword, description in keywords.items():
        if keyword in question:
            return description
    return "Sorry, ik heb geen informatie over dat onderwerp."

def find_best_match(user_input):
    best_match = None
    best_score = float('inf')

    for keyword, description in keywords.items():
        score = levenshtein_distance(user_input, keyword)

        if score < best_score:
            best_score = score
            best_match = keyword
        
    for keyword, description in keywords.items():
        if keyword in best_match:
            return description, best_score
    return best_match

def quiz():
  global isRunning
  while (isRunning):
      """Hoofdprogramma dat de gebruiker een vraag laat stellen."""
      print("Welkom! Stel een vraag, zoals 'Wie was Charles Babbage?' of type 'stop' om te stoppen.")
      question = input("Uw vraag: ")
      if question == "stop":
          isRunning = False
          break
      answer = find_best_match(question)
      print(f"Antwoord: {answer}")
      print("--------------------------------")

if __name__ == "__main__":
  quiz()

# https://github.com/dwyl/english-words/blob/master/words_alpha.txt

# Read all the words but keep only the 5-letter words
with open("data-processing\\words_alpha.txt", "r") as f:
    words = [line.strip() for line in f if len(line.strip()) == 5]

# Output a JS file that creates an string array variable from the list above
with open("data-processing\\game_data.js", "w") as f:
    f.write(f"wordPool = {words}")
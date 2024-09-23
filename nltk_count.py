import nltk

nltk.download("stopwords")
from nltk.corpus import stopwords

stop_words = stopwords.words("english")
print("Number of stop words is ", len(stop_words))
print("Stop words are:", stop_words)

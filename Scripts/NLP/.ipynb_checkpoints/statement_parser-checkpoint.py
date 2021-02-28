from nltk import sent_tokenize
from nltk import word_tokenize
import re


def split_statements(my_list):
    text=" ".join(my_list)
    text=re.sub(r'[|]','.',text)

    sentences=split_sentences(text)
    declarative_sentences = [x for x in sentences if x[-1] not in ['?']]
    return declarative_sentences

def filter_sentence(sentence):
    sentence=re.sub(r'\n|\t|\s+',' ',sentence)
    if len(word_tokenize(sentence))>=5:
        return sentence

    return None
def split_sentences(text):
    sentences = sent_tokenize(text)


    sentences=[filter_sentence(i) for i in sentences if filter_sentence(i)]


    return sentences

from bs4 import BeautifulSoup
from bs4.element import Comment
import requests
import sys
import re
from datetime import datetime, timezone
import json
import base64
import argparse

sys.path.append("../NLP")
sys.path.append("../")
import statement_parser
import config as cfg

# Parsing argument

"""
parser = argparse.ArgumentParser(description='This script will scrape the given URL and pushed the data to GitHub')
parser.add_argument('-gu', '--gituser', required=True, help='GitHub username')
parser.add_argument('-gp', '--gitpass', required=True, help='GitHub password')

args = parser.parse_args()
git_username = args.gituser
git_password = args.gitpass
"""
git_username=cfg.GIT_USERNAME
git_password=cfg.GIT_PASSWORD
git_access=cfg.ACCESS_TOKEN

if not git_username:
    sys.exit("Error: No Git Username specified in config file")
if not git_password:
    sys.exit("Error: No Git Password specified in config file")
if not git_access:
    sys.exit("Error: No Git ACCESS specified in config file")
def tag_visible(element):
    if element.parent.name in ['style', 'script', 'head', 'title', 'meta', '[document]']:
        return False
    if isinstance(element, Comment):
        return False
    return True


def text_from_html(body):
    soup = BeautifulSoup(body, 'html.parser')
    texts = soup.findAll(text=True)
    visible_texts = filter(tag_visible, texts)  
    return list(visible_texts)


def is_a_title(fragment):
    # define if >50% of words are titles

    words=fragment.split()
    if words:
        count=sum(1 for word in words if word.istitle())
        return count/len(words) > .5
    return True


def is_a_copyright_phrase(fragment):
    if len(re.findall(r'[©®™]', fragment)) > 0:
        return True
    elif len(re.findall(r'copyright', fragment)) > 0:
        return True
    return False


def clean(data):
    data = [x for x in data if x not in ['\n', '', ' ']]
    data = [x for x in data if not is_a_copyright_phrase(x)]
    data = [x for x in data if not is_a_title(x)]
    return data


def merge_open_parenthesis(data):
    for i, sentence in enumerate(data):
        if i < len(data)-1:
            if sentence.count("(") > sentence.count(")"):
                next_sentence = data[i+1]
                if next_sentence.count(")") > next_sentence.count("("):
                    data[i] = sentence+next_sentence
                    del data[i+1]
    return data


def merge_open_quotes(data):
    for i,sentence in enumerate(data):
        if i < len(data)-1:
            # odd number of quotes
            if sentence.count('"') % 2 == 1:
                next_sentence=data[i+1]
                if next_sentence.count('"') % 2 == 1:
                    data[i] = sentence+next_sentence
                    del data[i+1]
    return data


def sentence_to_object(sentence, id):
    return {'id': id, 'sentence': sentence, 'fact': False, 'misinformation': False, 'opinion':False,'temporal':False,'ignore':False,
            'sentence_category': 'Uncategorized', 'temporal': False}

def scrape_and_upload(URL,cat="Uncategorized"):
    # Cleaning data
    html = requests.get(URL).text
    data = text_from_html(html)
    data = clean(data)
    data = statement_parser.split_statements(data)
    data = merge_open_parenthesis(data)
    data = merge_open_quotes(data)

    # Composing data
    json_data = {}
    json_data['document_id'] = -1
    json_data['url'] = URL
    json_data['document_category'] = cat
    json_data['annotators'] = []
    json_data['author'] = 'Unknown'
    json_data['language'] = 'en'
    json_data['scrape_timestamp'] = str(datetime.now(timezone.utc))
    sentences = [sentence_to_object(s, i) for i, s in enumerate(data)]
    json_data['sentences'] = sentences

    my_json = json.dumps(json_data, indent=4)


    # --- Pushing to GitHub --- #
    URL_GitHub_PENDING_DIRECTORY = cfg.GIT_REPO
    URL_GitHub_PENDING_COUNTER = URL_GitHub_PENDING_DIRECTORY + "config_pending.txt"


    # Getting the current file naming counter available
    response = requests.get(URL_GitHub_PENDING_COUNTER, headers={'Content-Type':'text/json','Authorization': 'token '+git_access})
    print(response.content)
    config_data = response.json()
    config_data_sha = config_data["sha"]

    current_filename = int(base64.b64decode(config_data["content"]))
    next_counter = current_filename + 1
    current_filename = "pending_" + str(current_filename) + ".json"

    # Push the data
    URL_GitHub_PENDING_NEWDATA = URL_GitHub_PENDING_DIRECTORY + current_filename
    encoded_content = base64.b64encode(my_json.encode("utf-8")).decode("utf-8")
    headers = {"Content-Type": "application/json",'Authorization': 'token '+git_access}
    git_data = {"message": "Commit from Python basic scraper", "content": encoded_content}
    response = requests.put(URL_GitHub_PENDING_NEWDATA, data=json.dumps(git_data), headers=headers)
    print(response.text)

    # Update the counter
    encoded_next_counter = base64.b64encode(str(next_counter).encode("utf-8")).decode("utf-8")
    git_data = {"message": "Commit from Python basic scraper", "content": encoded_next_counter, "sha": config_data_sha}
    response = requests.put(URL_GitHub_PENDING_COUNTER, data=json.dumps(git_data), headers=headers)
    print(response.text)

    print("Data is pushed to the repository: " + current_filename)


#process urls file
with open(cfg.URL_FILE) as url_file:
    contents=url_file.readlines()

if contents:
    for line in contents:
        cat,url=line.split(",")
        print(f'Processing {url} in category {cat}')
        scrape_and_upload(url.strip(),cat)
else:
    print(f"Error, no URLS in {cfg.URL_FILE}")

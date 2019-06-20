import argparse
import json
import pandas as pd
import pyperclip
import requests
from collections import OrderedDict
from termcolor import colored

databasePath = 'src/db.json'


def load_database():
    with open(databasePath) as json_file:
        data = json.load(json_file)

    print(f'Loaded database with {len(data)} elements')

    return data


def load_products():
    # URL hentes fra https://www.vinmonopolet.no/datadeling
    produkturl = 'https://www.vinmonopolet.no/medias/sys_master/products/products/hbc/hb0/8834253127710/produkter.csv'  # noqa
    varetyper = [
        'India pale ale',
        'Porter & stout',
        'Surøl',
        'Spesial',
        'Klosterstil',
        'Saison farmhouse ale',
        'Lys lager',
        'Pale ale',
        'Hveteøl',
        'Lys ale',
        'Mørk lager',
        'Barley wine',
        'Brown ale',
        'Red/amber',
        'Scotch ale',
        'Mjød',
        'Sider'
    ]

    r = requests.get(produkturl)

    with open('produkter.csv', 'wb') as f:
        f.write(r.content)

    produktdata = pd.read_csv('produkter.csv', sep=';', encoding='ISO-8859-1')
    produktdata = produktdata[produktdata['Varetype'].isin(varetyper)]

    print(f'Loaded product list with {len(produktdata)} products')

    return produktdata


def save_database(database, path):
    # Sort data
    database = OrderedDict(sorted(database.items(), key=lambda t: int(t[0])))

    with open(path, 'w') as outfile:
        json.dump(database, outfile, indent=2)


def get_input():
    try:
        untappdnummer = int(input(colored('Skriv inn untappd nummer: ', 'yellow')))
        if not untappdnummer:
            return 0

        return untappdnummer
    except:
        return 0


database = load_database()
databaseset = set(database.keys())

print()

parser = argparse.ArgumentParser(description='Process some integers.')

parser.add_argument('--manual', dest='manual', action='store_true')
parser.set_defaults(manual=False)
args = parser.parse_args()

if args.manual:
    while True:
        polnummer = int(input(colored('Skriv inn vinmonopol nummer: ', 'yellow')))
        untappdnummer = int(input(colored('Skriv inn untappd nummer: ', 'yellow')))

        database[str(polnummer)] = untappdnummer
        save_database(database, databasePath)

        print()
else:
    produktdata = load_products()
    produktdata.sort_values(by='Varenummer', ascending=False, inplace=True)

    for index, row in produktdata.iterrows():
        if str(row['Varenummer']) in databaseset:
            continue

        print(f"Varenummer : {row['Varenummer']}")
        print(f"Varenavn   : {row['Varenavn']}")
        print(f"Produsent  : {row['Produsent']}")
        print(f"Varetype   : {row['Varetype']}")
        print(f"Land       : {row['Land']}")
        print(f"Alkohol    : {row['Alkohol']}")

        pyperclip.copy(row['Varenavn'])

        varenummer = get_input()
        if varenummer > 0:
            database[str(row['Varenummer'])] = varenummer
            save_database(database, databasePath)
            print(colored('Saved', 'green'))
        else:
            print(colored('Skipped', 'red'))

        print()

import json
import pandas as pd
import pyperclip
from collections import OrderedDict


databasePath = 'src/db.json'

def last_database():
    with open(databasePath) as json_file:
        data = json.load(json_file)

    print(f'Lastet database med {len(data)} elementer')

    return data


def last_produkter():
    # URL hentes fra https://www.vinmonopolet.no/datadeling
    produkturl = 'https://www.vinmonopolet.no/medias/sys_master/products/products/hbc/hb0/8834253127710/produkter.csv'
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
        'Scotch ale'
    ]

    produktdata = pd.read_csv(produkturl, sep=';', encoding='ISO-8859-1')
    produktdata = produktdata[produktdata['Varetype'].isin(varetyper)]

    print(f'Lastet produktliste med {len(produktdata)} produkter')

    return produktdata


database = last_database()
databaseset = set(database.keys())
produktdata = last_produkter()
produktdata.sort_values(by='Varenummer', ascending=False, inplace=True)

print()

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

    untappdnummer = input("Skriv inn untappd nummer: ")

    if not untappdnummer:
        break

    database[str(row['Varenummer'])] = int(untappdnummer)
    print()


# Sort data
database = OrderedDict(sorted(database.items(), key=lambda t: int(t[0])))

with open(databasePath, 'w') as outfile:
    json.dump(database, outfile, indent=2)

print("Lagret")

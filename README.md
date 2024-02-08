This project is unmaintaned. I suggest using [Winmonopolet](https://www.winmonopolet.no) and/or [Ølmonopolet](https://olmonopolet.app/)

# Vinmonopolet Untappd Linker

[![CircleCI](https://circleci.com/gh/Boren/tappdopolet/tree/master.svg?style=svg)](https://circleci.com/gh/Boren/tappdopolet/tree/master)

## Table of Contents

- [Vinmonopolet Untappd Linker](#vinmonopolet-untappd-linker)
  - [Table of Contents](#table-of-contents)
  - [About The Project](#about-the-project)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Build](#build)
  - [Updating the database](#updating-the-database)
  - [License](#license)

## About The Project

|           No match           |          Not had before           |         Had Before         |
| :--------------------------: | :-------------------------------: | :------------------------: |
| ![No match](img/nomatch.png) | ![Not had before](img/nothad.png) | ![Had before](img/had.png) |

Finding good beers in Vinmonopolets online store is a tedious task. You need to find the best beers and preferably some new ones. This extensions links Vinmonopolet with Untappd so that you can see what ratings the beers have and whether you have had them directly in the product listing.

## Getting Started

### Installation

The latest version is always available at the Chrome Web Store and packaged under releases.

### Build

Install dependencies using `yarn install` or `npm install`
The project can then be built using `yarn build` or `npm build`

## Updating the database

The link between Vinmonopolet and Untappd has to be manually generated.
In order to update the links when new products are added to Vinmonopolet you can manually edit `db.json` or run the supplied `oppdaterdatabase.py` script which makes the whole process easier.
Feel free to open a PR if you have added or updated some links.

In order to run the `oppdaterdatabase.py` script you need to install:

- `pandas`
- `pyperclip`

## License

Distributed under the MIT License. See `LICENSE` for more information.

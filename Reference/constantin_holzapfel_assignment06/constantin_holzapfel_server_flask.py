#Assignment06 by Constantin Holzapfel 3.12.18

#!flask/bin/python
from flask import Flask, render_template, request, redirect, url_for, abort, session
import os
import sys
import json
import random
import math
import csv

app = Flask(__name__)
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = 'some_really_long_random_string_here'

#creates a random data set for the bar chart in the barChart subwebpage
def createRandomIntList(min, max, r):
    randomList=[]
    for i in range(r):
      randomList.append(random.randint(min, max))
    return randomList

#reads in csv files and returns a dictionary for the bubbleChart subwebpage
def makeCSVdataset():
    dd={}

    life_expectancy=open('life_expectancy_years.csv', newline='')
    dd['life_expectancy']=list(csv.DictReader(life_expectancy, delimiter=';'))
    life_expectancy.close()

    income=open('income_per_person_gdppercapita_ppp_inflation_adjusted.csv', newline='')
    dd['income']=list(csv.DictReader(income, delimiter=';'))
    income.close()

    population=open('population_total.csv', newline='')
    dd['population']=list(csv.DictReader(population, delimiter=';'))
    population.close()

    geographies=open('Data Geographies - v1 - by Gapminder.csv', newline='')
    dd['geographies']=list(csv.DictReader(geographies, delimiter=';'))
    geographies.close()

    return dd

@app.route('/')
def index():
    return redirect(url_for('bubbleChart'))


@app.route('/bubbleChart')
#renders bubbleChart subwebpage
def bubbleChart():
    return render_template('constantin_holzapfel_bubbleChart.html',
                           data=json.dumps(makeCSVdataset()))

@app.route('/barChart')
#renders barChart subwebpage
def barChart(): 
    data = createRandomIntList(1, 100, 10)

    return render_template('constantin_holzapfel_barChart.html', data=json.dumps(data))


if __name__ == '__main__':
    app.run(debug=True)

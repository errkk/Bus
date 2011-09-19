#!/usr/bin/python

import csv
from lib.db import Database

def import_stops():

    try:
        file = open('../utils/converted.csv', 'U')
    except:
        print 'cant get file'

    try:
        stops = csv.reader( file, dialect=csv.excel_tab )
    except:
        print 'cant get csv'
        exit()


    db = Database()

    count = 0
    for row in stops:

        count = count + 1

        #stop after 10
#        if count > 10:
#            break

        thestop = row[0].split(',')

        stopcode = thestop[1]
        name = thestop[2]
        heading = thestop[3]
        smsCode = thestop[4]
        lat = thestop[5]
        lng = thestop[6]

        data = { 'id':stopcode, 'name':name, 'lat':lat, 'lng':lng, 'heading':heading, 'smsCode':smsCode }

        try:
            db.addRow(data)
            print 'Saving %s' % name
            count = count + 1
        except:
            print 'Fail for %s' % name

    print 'Saved %d records to busstops' % count

import_stops()



        

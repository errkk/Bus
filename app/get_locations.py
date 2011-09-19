__author__ = 'eric'

import urllib, csv, math
from convert import utmToLatLng


def utmify():



    url = 'http://www.tfl.gov.uk/tfl/businessandpartners/syndication/feed.aspx?email=errkkgeorge@gmail.com&feedId=10'

    try:
        file = urllib.urlopen( url )
    except:
        print 'cant get file'

    try:
        stops = csv.reader( file, dialect=csv.excel_tab )
    except:
        print 'cant get csv'
        exit()


    #db = Database()

    busstops = []

    if len(busstops) < 1:
        print 'nope'
    count = 0
    for row in stops:

        count = count + 1
        if count > 10:
            break
        thestop = row[0].split(',')



        name = thestop[1]

        id = thestop[0]

        smsCode = thestop[5]

        northing = thestop[3]
        easting = thestop[2]

        stopArea = thestop[6]


        print name

        print easting
        print northing

        try:
            print utmToLatLng(39, int(easting), int(northing) )
        except:
            print 'fail'
            
        #data = {'name':name,'id':id, 'northing':northing, 'easting':easting }
        #busstops.append( data )

        #db.addRow(data)



    print busstops

def findZone():

    number = 0

    while number < 1000:
        print number
        print utmToLatLng(number, int(517907), int(182704) )
        number = number + 1

utmify()

        

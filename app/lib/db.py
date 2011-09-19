from pymongo import Connection

class Database(object):

    # define global vars
    con = False # connection
    col = False # collection

    def __init__(self):

        # connect to database
        self.con = Connection()
        self.col = self.con.bus

    def addRow(self,data):
        try:
            self.col.busstops.save(data)
            return True
        except Database:
            return false

    def findStops(self,swLat,swLng,neLat,neLng):


#        print swLat,swLng,neLat,neLng
#        51.4591 -0.1396 51.4651 -0.1312
#        condition = {'lat':{'$gt': float(swLat), '$lt': float(neLat)},'lng':{'$gt': float(swLng), '$lt': float(neLng)}}
        condition = {'direction':99}
        
#        , '$lt':neLat},'lng':{'$gt': swLng, '$lt':neLng


#        cur = self.col.busstops.find( {'lng':{'$gt': swLat}} )

        try:
            for i in self.col.busstops.find( {'direction':99} ):
                print i
        except Database:
            print 'Error'


        
#        print self.col.busstops.find( condition ).sort("id").count()
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
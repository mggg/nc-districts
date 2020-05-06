import csv

outfile = open('../public/nc-geo/nc-ccr.csv', 'w')
op = csv.writer(outfile)

with open('./CCR.csv', 'r') as csvfile:
    rdr = csv.reader(csvfile)
    headers = None
    for row in rdr:
        if headers is None:
            headers = row
            op.writerow(row)
        else:
            state = row[headers.index('State')]
            if state == "NC":
                op.writerow(row)

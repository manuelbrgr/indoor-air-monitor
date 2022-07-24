import csv
import pandas as pd
import json


def csv_to_json(csvFilePath, ):
    jsonArray = []

    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)

        for row in csvReader:
            jsonArray.append(row)

        return jsonArray


def create_csv_file(file_path):
    print(file_path)
    with open(file_path, 'w') as createFile:
        createFile.write('')


def to_csv(payload, file_path, max_entries):
    lines = list()
    lines.append(payload)
    json_list = csv_to_json(file_path)

    i = 1
    for row in json_list:
        if (i >= max_entries):
            break
        lines.append(row)
        i = i+1

    df = pd.DataFrame.from_dict(lines)
    df.to_csv(file_path, encoding='utf-8', index=False)

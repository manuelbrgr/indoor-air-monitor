from datetime import datetime
import json
PREDICTION_DATA_PATH = "/home/remote/iot/prediction.json"

data = json.dumps({"co2_prediction": {"value": 420, "timestamp": datetime.now(
).isoformat()[:-3]+'Z'}})

f = open(PREDICTION_DATA_PATH, 'w')
f.write(data)

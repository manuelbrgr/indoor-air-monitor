from darts.dataprocessing.transformers import Scaler
from sklearn.preprocessing import MinMaxScaler
from darts.utils.missing_values import fill_missing_values
from darts.models import BlockRNNModel
from darts import TimeSeries
import datetime as dt
import matplotlib.pyplot as plt
import torch
import numpy as np
import pandas as pd
import time
from datetime import datetime
import json
# fix python path if working locally
from helpers import fix_pythonpath_if_working_locally
fix_pythonpath_if_working_locally()


# for reproducibility
torch.manual_seed(1)
np.random.seed(1)

PREDICTION_DATA_PATH = "/home/remote/iot/prediction.json"
HISTORY_DATA_PATH = "/home/remote/iot/15min.csv"

# Importing Training Set


def loadDataset(path):
    dataset = data = pd.read_csv(path)
    dataset.livingroom_window_open = dataset.livingroom_window_open.replace({
                                                                            True: 1, False: 0})
    dataset.livingroom_door_open = dataset.livingroom_window_open.replace({
                                                                          True: 1, False: 0})
    dataset.balcony_door_open = dataset.livingroom_door_open.replace({
                                                                     True: 1, False: 0})
    dataset.kitchen_window_open = dataset.kitchen_window_open.replace({
                                                                      True: 1, False: 0})
    dataset.timestamp = pd.Series([dt.datetime.strptime(
        date, '%Y-%m-%dT%H:%M:%S.%fZ') for date in list(dataset['timestamp'])]).round("10S")

    # Select features (columns) to be involved intro training and predictions
    cols = ["timestamp", "co2", "livingroom_window_open", "livingroom_door_open", "balcony_door_open",
            "kitchen_window_open", "rtemperature", "rhumidity", "temperature_outdoor", "humidity_outdoor"]
    return dataset[cols].drop_duplicates(subset=['timestamp'], keep='last')


def getPrediction():
    from pytorch_lightning import Trainer
    model_co2 = BlockRNNModel.load_model('co2_gru_90x90x50.pth.tar')
    dataset = loadDataset(HISTORY_DATA_PATH)

    # series to predict, in this case CO2
    series_co2 = fill_missing_values(TimeSeries.from_dataframe(
        dataset, 'timestamp', 'co2', fill_missing_dates=True, freq="10s"), fill='auto')

    # covariates to help predict the CO2 series
    covariates_livingroom_door_open = fill_missing_values(TimeSeries.from_dataframe(
        dataset, 'timestamp', 'livingroom_door_open', fill_missing_dates=True, freq="10s"), fill='auto')
    covariates_balcony_door_open = fill_missing_values(TimeSeries.from_dataframe(
        dataset, 'timestamp', 'balcony_door_open', fill_missing_dates=True, freq="10s"), fill='auto')
    covariates_livingroom_window_open = fill_missing_values(TimeSeries.from_dataframe(
        dataset, 'timestamp', 'livingroom_window_open', fill_missing_dates=True, freq="10s"), fill='auto')
    covariates_kitchen_window_open = fill_missing_values(TimeSeries.from_dataframe(
        dataset, 'timestamp', 'kitchen_window_open', fill_missing_dates=True, freq="10s"), fill='auto')
    covariates_temperature_indoors = fill_missing_values(TimeSeries.from_dataframe(
        dataset, 'timestamp', 'rtemperature', fill_missing_dates=True, freq="10s"), fill='auto')
    covariates_humidity_indoors = fill_missing_values(TimeSeries.from_dataframe(
        dataset, 'timestamp', 'rhumidity', fill_missing_dates=True, freq="10s"), fill='auto')
    covariates_temperature_outdoors = fill_missing_values(TimeSeries.from_dataframe(
        dataset, 'timestamp', 'temperature_outdoor', fill_missing_dates=True, freq="10s"), fill='auto')
    covariates_humidity_outdoors = fill_missing_values(TimeSeries.from_dataframe(
        dataset, 'timestamp', 'humidity_outdoor', fill_missing_dates=True, freq="10s"), fill='auto')

    scaler = Scaler()
    scaler_covariates = Scaler()
    series_co2_scaled = scaler.fit_transform(series_co2)

    covariates_livingroom_door_open_scaled, covariates_balcony_door_open_scaled, covariates_livingroom_window_open_scaled, covariates_kitchen_window_open_scaled, covariates_temperature_indoors_scaled, covariates_humidity_indoors_scaled, covariates_temperature_outdoors_scaled, covariates_humidity_outdoors_scaled = scaler_covariates.fit_transform(
        [covariates_livingroom_door_open, covariates_balcony_door_open, covariates_livingroom_window_open, covariates_kitchen_window_open, covariates_temperature_indoors, covariates_humidity_indoors, covariates_temperature_outdoors, covariates_humidity_outdoors])

    all_covariates_scaled = covariates_livingroom_door_open_scaled.stack(covariates_balcony_door_open_scaled).stack(covariates_livingroom_window_open_scaled).stack(covariates_kitchen_window_open_scaled).stack(
        covariates_temperature_indoors_scaled).stack(covariates_humidity_indoors_scaled).stack(covariates_temperature_outdoors_scaled).stack(covariates_humidity_outdoors_scaled)
    series_co2_scaled.plot(label="CO2")
    plt.legend()

    past = 90
    position = len(series_co2_scaled)-past
    past_series_co2_part = series_co2_scaled[position:(position+past)]
    past_covariates_part = all_covariates_scaled[position:(position+past)]
    pred_list_scaled = model_co2.predict(n=past, series=past_series_co2_part,
                                         past_covariates=past_covariates_part, trainer=Trainer(accelerator="cpu"))
    pred_list = scaler.inverse_transform(pred_list_scaled)

    pred_15m = pred_list.last_value()
    if pred_15m < 420:
        pred_15m = 420

    return round(pred_15m, 2)


def savePrediction(prediction):
    data = json.dumps({"co2_prediction": {"value": prediction,
                      "timestamp": datetime.now().isoformat()[:-3]+'Z'}})

    f = open(PREDICTION_DATA_PATH, 'w')
    f.write(data)
    
    print(prediction)


while True:
    try:
        savePrediction(getPrediction())
    except:
        print("Something went wrong while trying to create the prediction")
    time.sleep(20)

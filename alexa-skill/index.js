/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require("ask-sdk-core");
const { getAirQualityValue } = require("./getAirQualityValue.js");

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
    );
  },
  handle(handlerInput) {
    const speakOutput = "Air Base connected.";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput = "You can say hello to me! How can I help?";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const CarbonDioxideIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "CarbonDioxideIntent"
    );
  },
  async handle(handlerInput) {
    const airQuality = await getAirQualityValue().then((data) => {
      const speakOutput = "The current CO2 level is " + data.state.co2 + "ppm.";

      return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    });
    return airQuality;
  },
};

const TemperatureIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "TemperatureIntent"
    );
  },
  async handle(handlerInput) {
    const airQuality = await getAirQualityValue().then((data) => {
      const speakOutput =
        "The current indoor temperature is " +
        data.state.rtemperature +
        " degrees, outdoors it is " +
        data.state.temperature_outdoor +
        "degree Celsius";

      return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    });
    return airQuality;
  },
};

const HumidityIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "HumidityIntent"
    );
  },
  async handle(handlerInput) {
    const airQuality = await getAirQualityValue().then((data) => {
      const speakOutput =
        "The current relative humidity indoor´s is " +
        data.state.rhumidity +
        " percent, outdoors it is " +
        data.state.humidity_outdoor +
        " percent";

      return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    });
    return airQuality;
  },
};

const ParticulateMatterIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "ParticulateMatterIntent"
    );
  },
  async handle(handlerInput) {
    const airQuality = await getAirQualityValue().then((data) => {
      const speakOutput =
        "The pm1 levels are " +
        data.state.pm1 +
        "ppm. " +
        "The pm2 levels are " +
        data.state.pm2 +
        "ppm. " +
        "The pm10 levels are " +
        data.state.pm10 +
        "ppm.";

      return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    });
    return airQuality;
  },
};

const HeatingIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "HeatingIntent"
    );
  },
  async handle(handlerInput) {
    const airQuality = await getAirQualityValue().then((data) => {
      const speakOutput =
        "The current heating power is at " + data.state.heating + " percent.";

      return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    });
    return airQuality;
  },
};

const GasIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "GasIntent"
    );
  },
  async handle(handlerInput) {
    const airQuality = await getAirQualityValue().then((data) => {
      const speakOutput =
        "The ammonia level is at " +
        data.state.nh3 +
        "ppm. " +
        "The OX level is at " +
        data.state.ox +
        "ppm. " +
        "The RED level is at " +
        data.state.red +
        "ppm." +
        " T.V.O.C. levels are at " +
        data.state.tvoc +
        "ppm.";

      return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    });
    return airQuality;
  },
};

const DoorWindowIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "DoorWindowIntent"
    );
  },
  async handle(handlerInput) {
    const airQuality = await getAirQualityValue().then((data) => {
      const livingRoomDoor = data.state.livingroom_door_open
        ? "open"
        : "closed";
      const balconyDoor = data.state.balcony_door_open ? "open" : "closed";
      const livingRoomWindow = data.state.livingroom_window_open
        ? "open"
        : "closed";
      const kitchenWindow = data.state.kitchen_window_open ? "open" : "closed";
      const speakOutput =
        "The living room door is " +
        livingRoomDoor +
        ", the balcony door is " +
        balconyDoor +
        ". The living room window is " +
        livingRoomWindow +
        " and the kitchen window is " +
        kitchenWindow +
        ".";

      return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    });
    return airQuality;
  },
};

const SummaryIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "SummaryIntent"
    );
  },
  async handle(handlerInput) {
    const airQuality = await getAirQualityValue().then((data) => {
      const speakOutput = "I can´t give you a summary just yet.";

      return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    });
    return airQuality;
  },
};

const PredictionIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "PredictionIntent"
    );
  },
  async handle(handlerInput) {
    const airQuality = await getAirQualityValue().then((data) => {
      const speakOutput =
        "In 15 minutes, the CO2 level is predicted to reach " +
        data.state.prediction_co2.value +
        "ppm.";

      return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    });
    return airQuality;
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.CancelIntent" ||
        Alexa.getIntentName(handlerInput.requestEnvelope) ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const speakOutput = "Air Base disconnected!";

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet
 * */
const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.FallbackIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput = "Please repeat.";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs
 * */
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) ===
      "SessionEndedRequest"
    );
  },
  handle(handlerInput) {
    console.log(
      `~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`
    );
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
  },
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents
 * by defining them above, then also adding them to the request handler chain below
 * */
const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
    );
  },
  handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    const speakOutput = `You just triggered ${intentName}`;

    return (
      handlerInput.responseBuilder
        .speak(speakOutput)
        //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
        .getResponse()
    );
  },
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const speakOutput = "There was an error. Please try again.";
    console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    CarbonDioxideIntentHandler,
    TemperatureIntentHandler,
    HumidityIntentHandler,
    ParticulateMatterIntentHandler,
    HeatingIntentHandler,
    GasIntentHandler,
    DoorWindowIntentHandler,
    SummaryIntentHandler,
    PredictionIntentHandler,
    LaunchRequestHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent("sample/hello-world/v1.2")
  .lambda();

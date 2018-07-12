
import { message } from 'antd'

import { START_TIMER, STOP_TIMER } from 'redux-timers'
import { fetchGateways } from 'actions/gateways'

export const LOAD_SENSORS_REQUEST = 'LOAD_SENSORS_REQUEST'
export const LOAD_SENSORS_SUCCESS = 'LOAD_SENSORS_SUCCESS'
export const LOAD_SENSORS_FAILURE = 'LOAD_SENSORS_FAILURE'

export const UPDATE_SENSOR_REQUEST = 'UPDATE_SENSOR_REQUEST'
export const UPDATE_SENSOR_SUCCESS = 'UPDATE_SENSOR_SUCCESS'
export const UPDATE_SENSOR_FAILURE = 'UPDATE_SENSOR_FAILURE'

export const SENSOR_STATE_CHANGED = 'SENSOR_STATE_CHANGED'

export const SENSOR_NAME_EDIT_CHANGED = 'SENSOR_NAME_EDIT_CHANGED'

const loadSensorsRequest = () => ({
    type: LOAD_SENSORS_REQUEST
})

const loadSensorsSuccess = (lights) => ({
    type: LOAD_SENSORS_SUCCESS,
    payload: lights
})

const loadSensorsFailure = (error) => ({
    type: LOAD_SENSORS_FAILURE,
    payload: error
})

const updateSensorRequest = () => ({
    type: UPDATE_SENSOR_REQUEST
})

const updateSensorSuccess = () => ({
    type: UPDATE_SENSOR_SUCCESS
})

const updateSensorFailure = (error) => ({
    type: UPDATE_SENSOR_FAILURE,
    payload: error
})

export const sensorStateChanged = (sensorProps) => ({
    type: SENSOR_STATE_CHANGED,
    payload: sensorProps
})

export const nameEditChanged = (sensorId, name) => ({
    type: SENSOR_NAME_EDIT_CHANGED,
    payload: { sensorId, name }
})

const handleErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return response
}

export const startSensorPolling = () => (dispatch) =>
    dispatch({
        type: START_TIMER,
        payload: {
            timerName: 'pollSensors',
            dispatchFunc: fetchSensors(),
            timerInterval: 5000 
        }
    })


export const stopSensorPolling = () => (dispatch) => 
    dispatch({
        type: STOP_TIMER,
        payload: {
            timerName: 'pollSensors'
        }
    })

export const fetchSensors = () => (dispatch) =>
    dispatch(fetchGateways())
        .then(() => dispatch(loadSensorsRequest()))
        .then(() => fetch('/api/sensors'))
        .then(handleErrors)
        .then(res => res.json())
        .then(json => dispatch(loadSensorsSuccess(json)))
        .catch(error => { 
            message.error(error.message)
            dispatch(loadSensorsFailure(error))
        })

export const updateSensor = (gatewayId, sensor) => (dispatch) => {

    dispatch(updateSensorRequest())

    return fetch(`/api/gateways/${gatewayId}/sensors/${sensor.id}`, 
        { method: 'POST', body: sensor, headers: { 'content-type': 'application/json'}})
        .then(handleErrors)
        .then(res => res.json())
        .then(json => dispatch(updateSensorSuccess(json)))
        .catch(error => {
            message.error(error.message)
            dispatch(updateSensorFailure(error))
        })
}
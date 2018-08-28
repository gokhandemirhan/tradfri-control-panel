
import { message } from 'antd'

import { change } from 'redux-form'

import { START_TIMER, STOP_TIMER } from 'redux-timers'

export const LOAD_GATEWAY_REQUEST = 'LOAD_GATEWAY_REQUEST'
export const LOAD_GATEWAY_SUCCESS = 'LOAD_GATEWAY_SUCCESS'
export const LOAD_GATEWAY_FAILURE = 'LOAD_GATEWAY_FAILURE'

export const UPDATE_GATEWAY_REQUEST = 'UPDATE_GATEWAY_REQUEST'
export const UPDATE_GATEWAY_SUCCESS = 'UPDATE_GATEWAY_SUCCESS'
export const UPDATE_GATEWAY_FAILURE = 'UPDATE_GATEWAY_FAILURE'

export const GATEWAY_STATE_CHANGED = 'GATEWAY_STATE_CHANGED'

export const DISCOVER_GATEWAY_REQUEST = 'DISCOVER_GATEWAY_REQUEST'
export const DISCOVER_GATEWAY_SUCCESS = 'DISCOVER_GATEWAY_SUCCESS'
export const DISCOVER_GATEWAY_FAILURE = 'DISCOVER_GATEWAY_FAILURE'

export const GENERATE_IDENTITY_REQUEST = 'GENERATE_IDENTITY_REQUEST'
export const GENERATE_IDENTITY_SUCCESS = 'GENERATE_IDENTITY_SUCCESS'
export const GENERATE_IDENTITY_FAILURE = 'GENERATE_IDENTITY_FAILURE'

export const TEST_CONNECTION_REQUEST = 'TEST_CONNECTION_REQUEST'
export const TEST_CONNECTION_SUCCESS = 'TEST_CONNECTION_SUCCESS'
export const TEST_CONNECTION_FAILURE = 'TEST_CONNECTION_FAILURE'

const loadGatewayRequest = () => ({
    type: LOAD_GATEWAY_REQUEST
})

const loadGatewaySuccess = (gateway) => ({
    type: LOAD_GATEWAY_SUCCESS,
    payload: gateway
})

const loadGatewayFailure = (error) => ({
    type: LOAD_GATEWAY_FAILURE,
    payload: error
})

const updateGatewayRequest = () => ({
    type: UPDATE_GATEWAY_REQUEST
})

const updateGatewaySuccess = () => ({
    type: UPDATE_GATEWAY_SUCCESS
})

const updateGatewayFailure = (error) => ({
    type: UPDATE_GATEWAY_FAILURE,
    payload: error
})

const discoverGatewayRequest = () => ({
    type: DISCOVER_GATEWAY_REQUEST
})

const discoverGatewaySuccess = (discoveredGateway) => ({
    type: DISCOVER_GATEWAY_SUCCESS,
    payload: discoveredGateway
})

const discoverGatewayFailure = () => ({
    type: DISCOVER_GATEWAY_FAILURE
})

const generateIdentityRequest = () => ({
    type: GENERATE_IDENTITY_REQUEST
})

const generateIdentitySuccess = (identity) => ({
    type: GENERATE_IDENTITY_SUCCESS,
    payload: identity
})

const generateIdentityFailure = (error) => ({
    type: GENERATE_IDENTITY_FAILURE,
    payload: error
})

const testConnectionRequest = () => ({
    type: TEST_CONNECTION_REQUEST
})

const testConnectionSuccess = (testResult) => ({
    type: TEST_CONNECTION_SUCCESS,
    payload: testResult
})

const testConnectionFailure = (error) => ({
    type: TEST_CONNECTION_FAILURE,
    payload: error
})

export const gatewayStateChanged = (gatewayProps) => ({
    type: GATEWAY_STATE_CHANGED,
    payload: gatewayProps
})

const handleErrors = (response) => {
    if (!response.status >= 500) {
        throw Error(response.statusText)
    }
    return response
}

export const startGatewayPolling = () => (dispatch) =>
    dispatch({
        type: START_TIMER,
        payload: {
            timerName: 'pollGateway',
            dispatchFunc: fetchGateway(),
            timerInterval: 30000
        }
    })


export const stopGatewayPolling = () => (dispatch) =>
    dispatch({
        type: STOP_TIMER,
        payload: {
            timerName: 'pollGateway'
        }
    })


export const fetchGateway = () => (dispatch) => {

    dispatch(loadGatewayRequest())

    return fetch('/api/gateway')
        .then(handleErrors)
        .then(res => res.status === 404 ?
            Promise.resolve(dispatch(loadGatewaySuccess()))
                .then(() => dispatch(stopGatewayPolling())) :
            res.json()
                .then(json => dispatch(loadGatewaySuccess(json)))
                .catch(error => {
                    message.error(error.message)
                    dispatch(loadGatewayFailure(error))
                }))
}

export const updateGateway = (gateway) => (dispatch) => {

    dispatch(updateGatewayRequest())

    return fetch('/api/gateway',
        { method: 'POST', body: JSON.stringify(gateway), headers: { 'content-type': 'application/json' } })
        .then(handleErrors)
        .then(res => res.json())
        .then(json => dispatch(updateGatewaySuccess(json)))
        .catch(error => {
            message.error(error.message)
            dispatch(updateGatewayFailure(error))
        })
}

export const discoverGateway = () => (dispatch) => {
    dispatch(discoverGatewayRequest())

    return fetch('api/gateway/discover')
        .then(handleErrors)
        .then(res => res.status === 404 ?
            Promise.resolve(dispatch(discoverGatewaySuccess())) :
            res.json()
                .then(json => {
                    dispatch(change('GATEWAY', 'name', json.name))
                    dispatch(change('GATEWAY', 'hostname', json.addresses[0]))
                    dispatch(discoverGatewaySuccess(json))
                })
                .catch(error => {
                    message.error(error.message)
                    dispatch(discoverGatewayFailure())
                }))
}

export const generateIdentity = (hostname, securityCode) => (dispatch) => {
    dispatch(generateIdentityRequest())

    return fetch('api/gateway/identity',
        { method: 'POST', body: JSON.stringify({ hostname, securityCode }), headers: { 'content-type': 'application/json' } })
        .then(handleErrors)
        .then(res => res.ok ? res.json()
            .then(({ identity, psk }) => {
                dispatch(change('GATEWAY', 'identity', identity))
                dispatch(change('GATEWAY', 'psk', psk))
                dispatch(generateIdentitySuccess())
            })
            : res.json().then(json => dispatch(generateIdentityFailure(json))))
        .catch(error => {
            message.error(error.message)
            dispatch(generateIdentityFailure(error))
        })
}

export const testConnection = (hostname, identity, psk) => (dispatch) => {

    dispatch(testConnectionRequest())

    return fetch('/api/gateway/test',
        { method: 'POST', body: JSON.stringify({ hostname, identity, psk }), headers: { 'content-type': 'application/json' } })
        .then(handleErrors)
        .then(res => res.json())
        .then(json => dispatch(testConnectionSuccess(json)))
        .catch(error => {
            message.error(error.message)
            dispatch(testConnectionFailure(error))
        })
}

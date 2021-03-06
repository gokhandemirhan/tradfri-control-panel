import { Button, Input, List, Popover } from 'antd'
import PencilIcon from 'mdi-react/PencilIcon'
import * as R from 'ramda'
import React, { Component } from 'react'

import StatusIndicator from '@/components/StatusIndicator'
import { ISensor } from 'shared/types'

import './SensorItem.css'

interface ISensorItemProps {
    sensor: ISensor
    sensorStateChanged: (sensor: ISensor) => void
    updateSensor: (sensor: ISensor) => void
}

interface ISensorItemState {
    editNameVisible: boolean
    editNameText: string
}

const initialState = {
    editNameText: '',
    editNameVisible: false,
}

class SensorItem extends Component<ISensorItemProps, ISensorItemState> {

    constructor(props: Readonly<ISensorItemProps>) {
        super(props)
        this.state = initialState
    }

    public render() {
        return (
            <List.Item>
                <List.Item.Meta
                    title={this.title(this.props.sensor)}
                    description='Motion sensor'
                />
            </List.Item>
        )
    }

    private title(sensor: ISensor) {
        return (
            <div className='sensor-item__title'>
                <StatusIndicator title={statusTitle(sensor)} status={status(sensor)} />
                <span>{sensor.name}</span>
                <Popover
                    title='Edit name'
                    trigger='click'
                    visible={this.state.editNameVisible}
                    onVisibleChange={this.onEditNameVisibleChanged.bind(this)}
                    content={this.editName()}
                >
                    <span className='sensor-item__name-edit'>
                        <PencilIcon size={12} />
                    </span>
                </Popover>
            </div>
        )
    }

    private editName() {
        return (
            <div className='sensor-item__popover'>
                <Input value={this.state.editNameText} onChange={this.editNameChanged.bind(this)} />
                <Button type='primary' size='small' onClick={this.updateName.bind(this)} >Update</Button>
            </div>
        )
    }

    private onEditNameVisibleChanged(visible: boolean) {
        visible && this.setState({ editNameText: this.props.sensor.name })
        this.setState({ editNameVisible: visible })
    }

    private editNameChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ editNameText: event.target.value })
    }

    private updateName() {
        const newSensorState = { ...this.props.sensor, name: this.state.editNameText }
        this.props.updateSensor(newSensorState)
        this.props.sensorStateChanged(newSensorState)
        this.setState({ editNameVisible: false })
    }
}

const statusTitle = R.cond([
    [R.propEq('alive', true), R.always('Sensor is connected')],
    [R.T, R.always('Sensor is disconnected')]
])

const status = R.cond([
    [R.propEq('alive', true), R.always('online')],
    [R.T, R.always('offline')]
])

export default SensorItem

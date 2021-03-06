import * as R from 'ramda'
import React from 'react'

import { Card, Divider, Dropdown, Icon, Menu, Modal, Descriptions } from 'antd'
import { GatewayConnectionState, IGateway } from 'shared/types'

import StatusIndicator, { Status } from '@/components/StatusIndicator'
import GatewayEditFormContainer from '@/containers/gateway/GatewayEditFormContainer'

import './Gateway.css'

const { Item } = Descriptions

interface IGatewayProps {
    gateway: IGateway
    initialDataLoading: boolean
    dispatchSaveGateway: (gateway: IGateway) => void
    dispatchUpdateGateway: (gateway: Partial<IGateway>) => void
    dispatchDeleteGateway: () => void
    dispatchSubmitEditGatewayForm: () => void
    dispatchRebootGateway: () => void
    dispatchResetGateway: () => void
}

interface IGatewayState {
    editModalVisible: boolean
}

const initialState = {
    editModalVisible: false,
}

class Gateway extends React.Component<IGatewayProps, IGatewayState> {

    constructor(props: Readonly<IGatewayProps>) {
        super(props)
        this.state = initialState
    }

    public render = () => (
        <>
            <Card title={this.title()} extra={this.actionButtons()}>
                <Descriptions size='small' column={1}>
                    <Item label='Connection status'>
                        {statusTitle(this.props.gateway.connectionState)}
                    </Item>
                    <Item label='Hostname'>
                        {this.props.gateway.hostname}
                    </Item>
                    <Item label='Firmware version'>
                        {this.props.gateway.version}
                    </Item>
                </Descriptions>
            </Card>
            <Modal
                title='Edit gateway information'
                visible={this.state.editModalVisible}
                onOk={this.props.dispatchSubmitEditGatewayForm}
                onCancel={() => this.setEditModalVisible(false)}
            >
                <GatewayEditFormContainer onSubmit={this.handleSubmit} />
            </Modal>
        </>
    )

    private title = () => (
        <>
            <StatusIndicator
                title={statusTitle(this.props.gateway.connectionState)}
                status={status(this.props.gateway.connectionState)}
            />
            {this.props.gateway.name}
        </>
    )

    private actionButtons = () => (
        <div className='gateway__actions'>
            <a onClick={() => this.setEditModalVisible(true)}>Edit</a>
            <Divider type='vertical' />
            <a onClick={this.showDeleteConfirm}>Delete</a>
            <Divider type='vertical' />
            <Dropdown trigger={['click']} overlay={this.dropdown()}>
                <a>More <Icon type='down' /></a>
            </Dropdown>
        </div>
    )

    private dropdown = () => (
        <Menu>
          <Menu.Item>
            <a onClick={this.showRebootConfirm}>Reboot gateway</a>
          </Menu.Item>
          <Menu.Item>
            <a onClick={this.showResetConfirm} style={{ color: 'red'}}>Factory reset</a>
          </Menu.Item>
        </Menu>
      )

    private setEditModalVisible = (visible: boolean) => this.setState({ editModalVisible: visible })

    private showDeleteConfirm = () => {
        Modal.confirm({
            title: 'Delete gateway',
            content: 'Are you sure you want to delete the gateway?',
            maskClosable: true,
            onOk: this.handleDelete
        })
    }

    private showRebootConfirm = () => {
        Modal.confirm({
            title: 'Reboot gateway',
            content: 'Are you sure you want to reboot the gateway?',
            maskClosable: true,
            onOk: this.handleReboot
        })
    }

    private showResetConfirm = () => {
        Modal.confirm({
            title: 'Reset gateway',
            content: 'Are you sure you want to reset the gateway? ' +
                ' This wipes everything from the gateway, including paired devices, groups and moods! ' +
                ' You will also have to generate new credentials to authenticate with the gateway.',
            maskClosable: true,
            iconType: 'warning',
            onOk: this.handleReset
        })
    }

    private handleSubmit = (gateway: Partial<IGateway>) => {
        this.props.dispatchUpdateGateway(gateway)
        this.setEditModalVisible(false)
    }

    private handleDelete = () => {
        this.props.dispatchDeleteGateway()
    }

    private handleReboot = () => {
        this.props.dispatchRebootGateway()
    }

    private handleReset = () => {
        this.props.dispatchResetGateway()
    }
}

const statusTitle = R.cond<number, string>([
    [R.equals(GatewayConnectionState.CONNECTED), R.always('Connected to gateway')],
    [R.equals(GatewayConnectionState.DISCONNECTED), R.always('Gateway connection lost')],
    [R.equals(GatewayConnectionState.OFFLINE), R.always('Gateway is offline')],
    [R.T, R.always('Gateway is offline')]
])

const status = R.cond<number, Status>([
    [R.equals(GatewayConnectionState.CONNECTED), R.always('online')],
    [R.equals(GatewayConnectionState.DISCONNECTED), R.always('disconnected')],
    [R.T, R.always('offline')]
])

export default Gateway

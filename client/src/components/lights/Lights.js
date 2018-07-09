import React, { Component } from 'react'
import { Spin, Icon } from 'antd'
import PropTypes from 'prop-types'
import * as R from 'ramda'

import LightGroupCard from 'components/lights/LightGroupCard'

import 'components/lights/Lights.css'

class Lights extends Component {

    componentDidMount() {
        this.props.loadLights()
    }
    
    render() {
        return (
            <Spin spinning={this.props.dataLoading} style={{ marginTop: '240px'}} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}>
                <div className="card-container">
                    { !R.isEmpty(this.props.gateways) ? R.values(this.props.gateways).map((gateway, idx) => 
                        <LightGroupCard
                            key={idx}
                            gateway={gateway}
                            lights={this.getLightsForGateway(gateway)}
                            lightStateChanged={this.props.lightStateChanged}
                            updateLight={this.props.updateLight}
                        />)
                        : !this.props.dataLoading ? 'No lights found' : null
                    }
                </div>
            </Spin>
        )
    }

    getLightsForGateway({ id }) {
        return R.pickAll(this.props.gateways[id].lights, this.props.lights)
    }

}

Lights.propTypes = {
    gateways: PropTypes.object.isRequired,
    lights: PropTypes.object.isRequired,
    loadLights: PropTypes.func.isRequired,
    dataLoading: PropTypes.bool.isRequired,
    lightStateChanged: PropTypes.func.isRequired,
    updateLight: PropTypes.func.isRequired
}

export default Lights

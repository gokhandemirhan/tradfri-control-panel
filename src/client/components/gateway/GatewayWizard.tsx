import { Steps } from 'antd'
import React, { Component } from 'react'

import GatewayWizardFormContainer from '@/containers/gateway/GatewayWizardFormContainer'

import './GatewayWizard.css'

const { Step } = Steps

interface IGatewayWizardState {
    step: number
}

const initialState = {
    step: 0,
}

const steps = [{
    stepName: 'Discover',
    title: 'Discover a gateway on your local network',
}, {
    stepName: 'Authenticate',
    title: 'Generate authentication credentials',
}, {
    stepName: 'Test connection',
    title: 'Test gateway connection',
}]

class GatewayWizard extends Component<{}, IGatewayWizardState> {

    public scrollAnchor: HTMLDivElement | null

    constructor(props: {}) {
        super(props)
        this.state = initialState
        this.scrollAnchor = null
    }

    public render() {
        const { title } = steps[this.state.step]
        return (
            <div className='gateway-wizard' ref={(e) => this.scrollAnchor = e} >
                <div className='gateway-wizard__steps'>
                    <Steps size='small' current={this.state.step}>
                        {steps.map(({ stepName }, idx) => <Step key={idx} title={stepName} />)}
                    </Steps>
                </div>
                <div className='gateway-wizard__title'>
                    {title}
                </div>
                <div>
                    <GatewayWizardFormContainer
                        step={this.state.step}
                        nextStep={() => this.nextStep()}
                        previousStep={() => this.previousStep()}
                    />
                </div>
            </div>
        )
    }

    private nextStep() {
        this.setState({ step: Math.min(this.state.step + 1, 2) })
        this.scrollAnchor && this.scrollAnchor.scrollIntoView(true)
    }

    private previousStep() {
        this.setState({ step: Math.max(this.state.step - 1, 0) })
        this.scrollAnchor && this.scrollAnchor.scrollIntoView(true)
    }
}

export default GatewayWizard

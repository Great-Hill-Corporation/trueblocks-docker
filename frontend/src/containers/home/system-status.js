import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import {
  getStatus
} from '../../modules/trueblocks'
import {withPolling} from "../../modules/withPolling"

const SystemStatus = (props) => {
    return (
        <div className="system-status">
            <h1>System Status</h1>
            <SystemDetails {...props}/>
            <button onClick={props.changePage}>
            Settings
          </button>
        </div>
    )
}

const SystemDetails = (props) => {
        let syncPct = props.systemData.parityLatestBlock === "" | props.systemData.parityLatestBlock === 0 ? "0%" : Math.floor( 100 * props.systemData.lastConsolidated / props.systemData.parityLatestBlock) + "%";
        return (<div className={`system-details ${props.systemData.isConnected ? "connected" : "disconnected"}`}>
        <div className="item grouping">Connection</div>
        <div className="item">TrueBlocks daemon:</div>
        <div className={`item ${props.systemData.isConnected ? "connected" : "disconnected"}`}>{props.systemData.isConnected ? "Connected" : "Disconnected"}</div>
        <div className="item">Ethereum Node:</div>
        <div className={`item space-after ${props.systemData.isConnected ? "connected" : "disconnected"}`}>{props.systemData.isConnected ? "Connected" : "Disconnected"}</div>
        <div className="item grouping">Scraper</div>
        <div className="item">Status:</div>
        <div className="item">{props.systemData.isScraping ? "Scraping" : "Paused"}</div>
        <div className="item">Block Number:</div>
        <div className="item space-after">{props.systemData.lastConsolidated}</div>
        <div className="item grouping">Ethereum Node</div>
        <div className="item">Current block:</div>
        <div className="item">{props.systemData.parityLatestBlock}</div>
        <div className="item">Highest block:</div>
        <div className="item space-after">{props.systemData.parityLatestBlock}</div>
        <div className="item grouping">System Version</div>
        <div className="item">TrueBlocks:</div>
        <div className="item">{props.systemData.trueblocks_version}</div>
        <div className="item">Ethereum:</div>
        <div className="item">{props.systemData.client_version}</div>
        <div className="progress-bar green stripes">
            <span style={{width: syncPct}}></span>
        </div>
        {/* <p>Api endpoint: localhost:8080</p>
        <p>Client version: Trueblocks v0.7</p>
        <p>Disk size: 9GB</p> */}
    
        {/* <p>Node status: {props.systemData.isScraping}</p>
        <p>Scraping: true</p>
        <p>Block Number: 7241000</p>
        <p>Head of chain: 7500000</p>
        <p>Api endpoint: localhost:8080</p>
        <p>Client version: Trueblocks v0.7</p>
        <p>Disk size: 9GB</p> */}
      </div>)
    
}

const mapStateToProps = ({ trueblocks }) => (
    {
        systemData: trueblocks.systemData,
        isLoading: trueblocks.isLoading
    }
)

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getStatus,
      changePage: () => push('/settings')
    },
    dispatch
  )

export default withPolling(getStatus)(connect(
  mapStateToProps,
  mapDispatchToProps
)(SystemStatus))

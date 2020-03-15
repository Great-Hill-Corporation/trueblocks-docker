//----------------------------------------------------------------------
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { dispatcher_Monitors } from './dispatchers';

import { BreadCrumb } from 'components';
import { Debug } from 'components';
import { isReady } from 'components';
import { DataTable } from 'components';
import { isError, NotReady, isEmpty, EmptyQuery } from 'components';
import './monitors.css';

// EXISTING_CODE
import { dispatcher_RemoveMonitor, dispatcher_AddMonitor } from './dispatchers';
// EXISTING_CODE

//----------------------------------------------------------------------
class MonitorsInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cur_submenu: props.cur_submenu
    };
    this.tableEar = this.tableEar.bind(this);
    // EXISTING_CODE
    // EXISTING_CODE
  }

  componentDidMount = () => {
    this.props.dispatcher_Monitors(this.state.cur_submenu.route + '?' + this.state.cur_submenu.query);
  };

  // EXISTING_CODE
  switch_page = () => {
    this.setState({ ...this.state });
    window.location = 'http://localhost:3000/monitors/addresses/status+modes=monitors&details&ether';
  };
  async add(addr) {
    return await this.props.dispatcher_AddMonitor(addr);
  }
  rangeCalc = () => {
    return '100';
  };
  // EXISTING_CODE

  tableEar = (cmd, arg) => {
    // EXISTING_CODE
    if (cmd === 'remove') {
      this.props.dispatcher_RemoveMonitor(arg, true);
    } else if (cmd === 'delete' || cmd === 'undo') {
      this.props.dispatcher_RemoveMonitor(arg, false);
      this.setState({ ...this.state });
    } else if (cmd === 'expand') {
      this.setState({
        subpage: arg
      });
    } else if (cmd === 'add') {
      this.props.dispatcher_AddMonitor(arg);
      // this.setState({ ...this.state });
      // window.open('http://localhost:3000/addresses/monitors/status+modes=monitors&details&ether', '_self');
      // this.add(arg).then(this.switch_page());
    }
    // EXISTING_CODE
  };

  getInnerPage = () => {
    if (this.state.cur_submenu.subpage === 'dashboard') return <div>The dashboard for Monitors</div>;
    if (isError(this.props)) return <NotReady {...this.props} />;
    else if (!isReady(this.props, this.props.data)) return <NotReady {...this.props} />;
    else if (isEmpty(this.props.data)) return <EmptyQuery query={this.state.subpage} />;
    let displayMap = new Map();
    // EXISTING_CODE
    if (this.state.cur_submenu.subpage === 'addresses') {
      displayMap.set('symbol', { showing: true });
      displayMap.set('group', { showing: true });
      displayMap.set('name', { showing: true });
      displayMap.set('address', { showing: true });
      displayMap.set('nAppearances', { showing: true, name: 'Count' });
      displayMap.set('firstAppearance', { showing: true, name: 'First' });
      displayMap.set('latestAppearance', { showing: true, name: 'Latest' });
      // displayMap.set('appearanceRange', { showing: true, name: 'Range', calc: this.rangeCalc });
      // displayMap.set('appearanceInterval', { showing: true, name: 'Interval', calc: this.intervalCalc });
      displayMap.set('sizeInBytes', { showing: true, name: 'Size (Bytes)' });
    } else {
      displayMap.set('group', { showing: true });
      displayMap.set('name', { showing: true });
      displayMap.set('address', { showing: true });
      displayMap.set('symbol', { showing: true });
      displayMap.set('source', { showing: true });
      displayMap.set('logo', { showing: true });
      displayMap.set('description', { showing: true });
    }
    // EXISTING_CODE
    return (
      <DataTable
        displayMap={displayMap}
        theFields={this.props.fieldList}
        theData={this.props.data}
        headerIcons={['add']}
        icons={['explore', 'refresh', 'explore|remove', 'delete|undo']}
        tableEar={this.tableEar}
      />
    );
  };

  render = () => {
    return (
      <div className="inner-panel">
        <BreadCrumb page="Monitors" menu={this.state.cur_submenu} />
        {this.getInnerPage()}
        {localStorage.getItem('debug') ? (
          <Debug state={this.state} fieldList={this.props.fieldList} meta={this.props.meta} />
        ) : (
          <Fragment></Fragment>
        )}
      </div>
    );
  };
}

// EXISTING_CODE
//---------------------------------------------------------------------
export const AddNewAddress = (props) => {
  let inputAddress;

  const onSubmit = (el) => {
    el.preventDefault();
    props.dispatcher_AddMonitor(inputAddress.value);
  };

  return (
    <div className="address-add">
      <form onSubmit={onSubmit}>
        <input placeholder="0x0000...0000" ref={(user_input) => (inputAddress = user_input)}></input>
        <button>Add Monitor</button>
      </form>
    </div>
  );
};
// EXISTING_CODE

//----------------------------------------------------------------------
const mapStateToProps = ({ router, reducer_Panels, reducer_Status, reducer_Monitors }) => ({
  // EXISTING_CODE
  // EXISTING_CODE
  location: router.location,
  sysConnected: reducer_Panels.isStatusExpanded ? reducer_Status.isConnected : true,
  sysError: reducer_Panels.isStatusExpanded ? reducer_Status.error : false,
  isLoading: reducer_Monitors.isLoading,
  error: reducer_Monitors.error,
  fieldList: reducer_Monitors.fieldList,
  data: reducer_Monitors.data,
  meta: reducer_Monitors.meta
});

//----------------------------------------------------------------------
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      // EXISTING_CODE
      dispatcher_RemoveMonitor,
      dispatcher_AddMonitor,
      // EXISTING_CODE
      dispatcher_Monitors
    },
    dispatch
  );

//----------------------------------------------------------------------
export default connect(mapStateToProps, mapDispatchToProps)(MonitorsInner);

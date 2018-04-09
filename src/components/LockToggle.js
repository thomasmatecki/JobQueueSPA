/*
 * Copyright (c) 2018 Thomas Matecki - All Rights Reserved
 *
 * This code is part of web application build for demostrative
 * purposes only. You may use, distribute and modify this code
 * as you wish.
 */

import React, {Component} from 'react';
import {TOGGLE_QUEUE} from "../constants";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import Toggle from 'material-ui/Toggle';
import SnackBar from 'material-ui/Snackbar';

/**
 * When toggled, dispatch redux action to all clients
 * via websocket (see `ActionBroker` in actions.js).
 *
 * @param websocket
 * @param locked
 * @returns {*}
 * @constructor
 */
const LockToggle = ({websocket, locked}) =>
    (<div>
      <Toggle
          label="Pause"
          defaultToggled={locked}
          onToggle={(event, isInputChecked) =>
              websocket.send(JSON.stringify({
                type: TOGGLE_QUEUE,
                status: isInputChecked
              }))
          }/>
      <SnackBar
          open={locked}
          message={"The Queue Is Locked!"}
          autoHideDuration={4000}/>
    </div>);


LockToggle.propTypes = {
  locked: PropTypes.bool.isRequired,
  websocket: PropTypes.object.isRequired
};


export const LockToggleContainer = connect(
    (state, props) => ({locked: state.locked}),
    (dispatch, props) => ({}),
)(LockToggle);


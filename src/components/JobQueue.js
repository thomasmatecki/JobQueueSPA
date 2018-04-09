/*
 * Copyright (c) 2018 Thomas Matecki - All Rights Reserved
 *
 * This code is part of web application build for demostrative
 * purposes only. You may use, distribute and modify this code
 * as you wish.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {JobCard} from "./JobCard";
import Paper from 'material-ui/Paper';

import getMuiTheme from "material-ui/styles/getMuiTheme";

const muiTheme = getMuiTheme();

const style = {
  emptyPaper: {
    color: muiTheme.palette.primary3Color,
    textAlign: 'center',
    padding: 20,
  }
};

const JobQueue = ({queue}) => (
    <Paper
        style={{
          padding: 5
        }}
        zDepth={1}>
      {queue.length === 0 ?
          <div style={style.emptyPaper}>
            The queue is empty
          </div> :
          <div>
            {queue.map((job, idx) => {
              return (<JobCard
                  key={idx}
                  idx={idx}
                  job={job}/>)
            })}
          </div>}
    </Paper>);


export const JobQueueContainer = connect(
    (state, props) => ({queue: state.queue}),
    (dispatch, props) => ({}),
)(JobQueue);
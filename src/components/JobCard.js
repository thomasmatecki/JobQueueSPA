/*
 * Copyright (c) 2018 Thomas Matecki - All Rights Reserved
 *
 * This code is part of web application build for demostrative
 * purposes only. You may use, distribute and modify this code
 * as you wish.
 */

import React from 'react';
import {Card, CardActions, CardHeader, CardTitle} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import {CardTickerContainer} from "./CardTicker";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import {cancelJob} from './REST';
import {JobCancel} from "./JobCancel";

const muiTheme = getMuiTheme();

const style = {
  FirstInQueue: {
    backgroundColor: muiTheme.palette.primary1Color
  }
};

/**
 * Card displaying information for a single "Job".
 * @param job
 * @param idx
 * @returns {*}
 * @constructor
 */
export const JobCard = ({job, idx}) => {

  const jobCancel = React.createRef();

  return (
      <Card
          expanded={true}
          className="job-card"
          style={idx === 0 ? style.FirstInQueue : {}}>
        <div
            className="job-card-row">
          <CardTitle
              title={job.name}
              subtitle={job.id.toString().padStart(4, '0')}
              expandable={true}>
          </CardTitle>

          <CardTickerContainer
              submissionTime={job.submissionTime}
              statusDescription="In Queue"/>
        </div>
        <div
            className="job-card-row">
          <CardHeader
              title={`Processing Time: ${job.processingTime} ms`}
              subtitle={`Submitted: ${new Date(job.submissionTime).toString()}`}/>
          <CardActions style={{overflow: 'auto'}}>
            <JobCancel
                jobId={job.id}
                ref={jobCancel}/>
            <RaisedButton
                label="Cancel"
                secondary={true}
                className="action"
                disabled={idx === 0}
                onClick={() => jobCancel.current.openDialog()}/>
          </CardActions>
        </div>
      </Card>);
};


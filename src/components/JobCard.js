import React from 'react';
import {Card, CardActions, CardHeader, CardTitle} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import {CardTickerContainer} from "./CardTicker";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import {cancelJob} from './REST';

const muiTheme = getMuiTheme();

const style = {
  FirstInQueue: {
    backgroundColor: muiTheme.palette.primary1Color
  }
};


export const JobCard = ({job, idx}) => (
    <Card
        expanded={true}
        className="job-card"
        style={idx === 0 ? style.FirstInQueue : {}}>

      <div className="title-area">
        <CardTitle
            title={job.name}
            subtitle={job.id.toString().padStart(4, '0')}
            expandable={true}>
        </CardTitle>
        <CardHeader
            subtitle={`Submitted: ${new Date(job.submissionTime).toString()}`}
            title={`Processing Time: ${job.processingTime} ms`}/>
        <CardTickerContainer
            submissionTime={job.submissionTime}
            statusDescription="In Queue"/>
      </div>

      <CardActions style={{overflow: 'auto'}}>
        <RaisedButton
            label="Cancel"
            secondary={true}
            className="action"
            disabled={idx === 0}
            onClick={
              (event) => {
                cancelJob();
              }}/>
      </CardActions>

    </Card>);

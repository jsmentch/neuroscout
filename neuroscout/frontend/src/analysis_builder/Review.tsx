import * as React from 'react'
import {
  Col,
  Collapse,
  Card,
  Row,
  Table,
  Tag,
  Tooltip,
  Statistic,
  Space,
} from 'antd'
import { Link } from 'react-router-dom'

import {
  Dataset,
  Predictor,
  Transformation,
  Contrast,
  BidsModel,
} from '../coretypes'
import { alphaSort, formatDbTime, predictorColor } from '../utils'
import NeurovaultLinks from './NeuroVault'

const Panel = Collapse.Panel

interface ReviewProps {
  model: BidsModel
  analysisId?: string
  unsavedChanges: boolean
  availablePredictors: Predictor[]
  dataset?: Dataset
  user_name?: string
  created_at?: string
  modified_at?: string
}

class DatasetInfo extends React.Component<
  { dataset: Dataset },
  Record<string, never>
> {
  render() {
    const dataset = this.props.dataset
    return (
      <p>
        <div className="ant-statistic-title">Dataset</div>
        <a href={dataset.url} target="_blank" rel="noopener noreferrer">
          {dataset.name}
        </a>
      </p>
    )
    /*
    return (
      <Card title="Dataset" size="small">
        <a href={dataset.url} target="_blank" rel="noopener noreferrer">
          {dataset.name}
        </a>
      </Card>
    )
    */
  }
}

class ModelInput extends React.Component<
  { model: BidsModel },
  Record<string, never>
> {
  render() {
    if (this.props.model.Input === undefined) {
      return
    }
    const input = this.props.model.Input
    const runs = input.Run
      ? input.Run.sort().map(x => <li key={x}>{x}</li>)
      : []
    const sessions = input.Session ? alphaSort(input.Session).join(', ') : []

    return (
      <p>
        <div className="ant-statistic-title">Task</div>
        {input.Task ? input.Task : ''}
      </p>
    )
    /*
    return (
      <Card title="Task" size="small">
        {input.Task ? input.Task : ''}
      </Card>
    )
    */
  }
}

/* Object needs to have name as a key  */
class ReviewObjects extends React.Component<{
  input: (Transformation | Contrast)[]
}> {
  render() {
    const input = this.props.input
    const display: JSX.Element[] = []
    input.map((x, i) =>
      display.push(
        <div key={i}>
          <h3>{x.Name}:</h3>
          <pre>{JSON.stringify(x, null, 2)}</pre>
        </div>,
      ),
    )

    return <div>{display}</div>
  }
}

// <Panel header="Steps" key="Steps"><ModelSteps Steps={Steps as Step[]}/></Panel>
/* Only displaying run level step right now so this is unused.
class ModelStep extends React.Component<{step: Step}, Record<string, never>> {
  render() {
    let step = this.props.step;
    let xforms: any = '';
    if (step.Transformations !== undefined) {
        xforms = (
          <ReviewObjects input={step.Transformations}/>
        );
    }
    return (
      <div>
        <h3>Transformations</h3>
        {xforms}
      </div>
    );
  }
}

class ModelSteps extends React.Component<{Steps: Step[]}, Record<string, never>> {
  render() {
      if (this.props.Steps === undefined) {
        return;
      }
      let Steps = this.props.Steps;
      let display: any[] = [];
      Steps.map((x, i) => display.push(
        <Panel header={`${x.Level} Level`} key={i.toString()}><ModelStep step={x}/></Panel>)
      );
      return (
        <Collapse bordered={false}>
          {display}
        </Collapse>
      );
  }
}
*/

function getPredictorNames(
  model: BidsModel,
  availablePredictors: Predictor[],
): Predictor[] {
  let modelVars: string[] = []
  if (
    model.Steps &&
    model.Steps[0] &&
    model.Steps[0].Model &&
    model.Steps[0].Model.X
  ) {
    modelVars = model.Steps[0].Model.X
  }
  return availablePredictors.filter(x => modelVars.indexOf('' + x.name) > -1)
}
// In the future this will include the new named outputs from transformations.
class X extends React.Component<{ model: BidsModel; available: Predictor[] }> {
  render() {
    const { model, available } = this.props
    const displayVars = getPredictorNames(model, available)
    const display: JSX.Element[] = []
    displayVars.map((x, i) =>
      display.push(
        <div key={i}>
          <h3>{x.name}:</h3>
          <pre>{x.description}</pre>
        </div>,
      ),
    )
    displayVars.map(x => {
      return { name: x.name, description: x.description }
    })
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
    ]
    return <Table dataSource={displayVars} columns={columns} />
  }
}

export class Review extends React.Component<
  ReviewProps,
  Record<string, never>
> {
  render(): JSX.Element {
    const model = this.props.model
    const dataset = this.props.dataset
    const predictors = getPredictorNames(model, this.props.availablePredictors)
    const numberOfSubjects = model.Input?.Subject
      ? model.Input.Subject.length
      : 0
    const subjectIds = model.Input?.Subject
      ? alphaSort(model.Input.Subject).join(', ')
      : []
    let { Name, Steps } = model
    const { Description } = model

    if (model && model.Name) {
      Name = model.Name
    }
    if (model && model.Steps) {
      Steps = model.Steps
    }

    // Only looking at run level transfomraitons right now.
    let xforms: Transformation[] = []
    if (Steps && Steps[0] && Steps[0].Transformations) {
      xforms = Steps[0].Transformations
    }

    // Only looking at run level transfomraitons right now.
    let contrasts: Contrast[] = []
    if (Steps && Steps[0] && Steps[0].Contrasts) {
      contrasts = Steps[0].Contrasts
    }

    return (
      <Card title={Name}>
        <p>
          <Space>
            <span className="ant-statistic-title">Author: </span>
            <Link to={`/profile/${String(this.props.user_name)}`}>
              {this.props.user_name}
            </Link>
            {this.props.modified_at && (
              <>
                |<span className="ant-statistic-title"> Last Modified: </span>
                {formatDbTime(this.props.modified_at)}
              </>
            )}
          </Space>
          <br />
          {Description ? { Description } : 'No description'}
        </p>
        <Row gutter={[24, 16]}>
          {dataset && (
            <Col>
              <DatasetInfo dataset={dataset} />
            </Col>
          )}
          <Col>
            <ModelInput model={model} />
          </Col>
          <Col>
            <p>
              <div className="ant-statistic-title">Number of Subjects</div>
              <Tooltip title={subjectIds}>{numberOfSubjects}</Tooltip>
            </p>
          </Col>
        </Row>
        <p>
          <div className="ant-statistic-title">Predictors</div>
          {predictors.map(x => (
            <Tooltip key={x.name} title={x.description}>
              <Tag color={predictorColor(x)} key={x.name}>
                {x.name}
              </Tag>
            </Tooltip>
          ))}
        </p>
        <p>
          <div className="ant-statistic-title">Neurovault Uploads</div>
          <NeurovaultLinks analysisId={this.props.analysisId} />{' '}
        </p>
      </Card>
    )
  }
}

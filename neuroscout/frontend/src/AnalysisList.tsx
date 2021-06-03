/*
Resuable AnalysisList component used for displaying a list of analyses, e.g. on
the home page or on the 'browse public analysis' page
*/
import * as React from 'react';
import { Button, Row, Table } from 'antd';
import { MainCol, Space, StatusTag } from './HelperComponents';
import { AppAnalysis, Dataset } from './coretypes';
import { Link, Redirect } from 'react-router-dom';

const tableLocale = {
    filterConfirm: 'Ok',
    filterReset: 'Reset',
    emptyText: 'No Analyses',
};

export interface AnalysisListProps {
    loggedIn?: boolean;
    publicList?: boolean;
    analyses: AppAnalysis[] | null;
    cloneAnalysis: (id: string) => Promise<string>;
    onDelete?: (analysis: AppAnalysis) => void;
    children?: React.ReactNode;
    datasets: Dataset[];
    loading?: boolean;
    showOwner?: boolean;
}

export class AnalysisListTable extends React.Component<
AnalysisListProps,
{ redirectId: string }
> {
    state = { redirectId: '' };

    render() {
        if (this.state.redirectId !== '') {
            return <Redirect to={'/builder/' + this.state.redirectId} />;
        }
        const {
            analyses,
            datasets,
            publicList,
            cloneAnalysis,
            onDelete,
            showOwner,
        } = this.props;

        // Define columns of the analysis table
        // Open link: always (opens analysis in Builder)
        // Delete button: only if not a public list and analysis is in draft mode
        // Clone button: any analysis
        const analysisTableColumns: any[] = [
            {
                title: 'ID',
                dataIndex: 'id',
                sorter: (a, b) => a.id.localeCompare(b.id),
            },
            {
                title: 'Name',
                render: (text, record: AppAnalysis) => (
                    <Link to={`/builder/${record.id}`}>
                        <div className="recordName">
                            {record.name ? record.name : 'Untitled'}
                        </div>
                    </Link>
                ),
                sorter: (a, b) => a.name.localeCompare(b.name),
            },
            {
                title: 'Status',
                dataIndex: 'status',
                render: (text, record) => <StatusTag status={record.status} />,
                sorter: (a, b) => a.status.localeCompare(b.status),
            },
            {
                title: 'Modified at',
                dataIndex: 'modified_at',
                defaultSortOrder: 'descend' as const,
                sorter: (a, b) => a.modified_at.localeCompare(b.modified_at),
                render: (text) => {
                    const date = text.split('-');
                    return (
                        <>
                            {date[2].slice(0, 2)}-{date[1]}-{date[0].slice(2, 4)}
                        </>
                    );
                },
            },
            {
                title: 'Dataset',
                dataIndex: 'dataset_id',
                render: (text, record) => {
                    const dataset: any = datasets.filter((x) => {
                        return x.id === text.toString();
                    });
                    let name = ' ';
                    if (!!dataset && dataset.length === 1) {
                        name = dataset[0].name;
                    }
                    return <>{name}</>;
                },
                sorter: (a, b) => {
                    let dataset: Dataset | undefined = datasets.find((x) => {
                        return x.id === a.name.toString();
                    });
                    a = !!dataset && !!dataset.name ? dataset.name : '';
                    dataset = datasets.find((x) => {
                        return x.id === b.name.toString();
                    });
                    b = !!dataset && !!dataset.name ? dataset.name : '';
                    return a.localeCompare(b);
                },
            },
        ];

        if (showOwner) {
            analysisTableColumns.push({
                title: 'Author',
                dataIndex: 'user_name',
                sorter: (a, b) => ('' + a.user_name).localeCompare(b.user_name),
                render: (text, record) => (
                    <Link to={`/profile/${record.user_name}`}> {record.user_name} </Link>
                ),
            });
        }

        if (publicList) {
            analysisTableColumns.splice(2, 1);
        }

        if (this.props.loggedIn) {
            analysisTableColumns.push({
                title: 'Actions',
                render: (text, record: AppAnalysis) => (
                    <span>
                        {record.status === 'PASSED' && (
                            <>
                                <Button
                                    type="primary"
                                    ghost
                                    onClick={() => {
                                        this.props.cloneAnalysis(record.id).then((id) => {
                                            this.setState({ redirectId: id });
                                        });
                                    }}
                                >
                  Clone
                                </Button>
                                <Space />
                            </>
                        )}
                        {!publicList && ['DRAFT', 'FAILED'].includes(record.status) && (
                            <Button
                                danger
                                ghost
                                onClick={() => onDelete!(record)}
                            >
                Delete
                            </Button>
                        )}
                    </span>
                ),
            });
        }

        return (
            <div>
                <Table
                    columns={analysisTableColumns}
                    rowKey="id"
                    size="small"
                    dataSource={analyses === null ? [] : analyses}
                    loading={analyses === null || !!this.props.loading}
                    expandedRowRender={(record) => <p>{record.description}</p>}
                    pagination={
                        analyses !== null && analyses.length > 20
                            ? { position: ['bottomRight'] }
                            : false
                    }
                    locale={tableLocale}
                />
            </div>
        );
    }
}

// wrap table in components for use by itself as route
const AnalysisList = (props: AnalysisListProps) => {
    return (
        <div>
            <Row justify="center">
                <MainCol>
                    <h3>
                        {props.publicList ? 'Public analyses' : 'Your saved analyses'}
                    </h3>
                    <br />
                    <AnalysisListTable {...props} />
                </MainCol>
            </Row>
        </div>
    );
};

export default AnalysisList;

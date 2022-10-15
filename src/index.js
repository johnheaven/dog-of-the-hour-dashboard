import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';

class DothDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // get body data for monthly view
        axios.get('http://127.0.0.1:5000/all-views')
        .then(res => {
            this.setState({allData: res.data});
        }).catch(error => {console.error(error)});
    }

    render() {
        if (this.state.allData)
            return (
                <>
                <Container>
                    <Stack gap={5}>
                        <Row>
                            <section class="current-dog">
                                <CurrentDog data={this.state.allData.current_dog} />
                            </section>
                        </Row>
                        <Row>
                            <section>
                                <TodaysDogs data={this.state.allData.todays_dogs} />
                            </section>
                        </Row>
                        <Row>
                            <section class="monthly">
                                <Monthly data={this.state.allData.monthly} />
                            </section>
                        </Row>
                        <Row>
                            <section class="leaderboard">
                                <RunsLeaderboard data={this.state.allData.runs_by_month.table} />
                            </section>
                        </Row>
                    </Stack>
                </Container>
                </>
            );
        else
            return (<h1>Loading...</h1>)
    }

}

function Monthly({data}) {
    return (
    <>
    <BsTable tableData={data.table} title='Monthly Standings' />
    </>
    );
}

function BsTable({tableData, title}) {
    /* tableData is the rows of the table.
    An array, each item a row.
    The first row is assumed to be the header row.
    title is the heading above the table, i.e. wrapped in <h2> */

    if (tableData && title) {
        return (
            <>
            <h2>{title}</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                    {tableData.shift().map(heading => {
                        return (<th key={heading}>{heading}</th>)
                    })}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map(row => {
                        return (
                            <tr>{row.map(cell => {
                                return(<td>{cell}</td>)
                            }

                            )}</tr>
                            );}
                        )
                    } 
                </tbody>
            </Table>
            </>
        )
    };
}

function CurrentDog({data}) {
    if (data) {
        return (
            <>
                <h2>{data.dogname} is Dog of the Hour!</h2>
                <span class="doth-current-hour">{data.date}</span>
            </>
        );
    }

}

function TodaysDogs({data}) {
    if (data) {
        return (
            <BsTable tableData={data.table} title={"Today's Dogs"} />
        )
    }
}

function RunsLeaderboard({data}) {
    if (data) {
        return (
            <BsTable tableData={data} title={'Runs Leaderboard'} />
        )
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<DothDashboard />);

/* React imports */
import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';

/* React-Bootstrap stuff */
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Navbar from 'react-bootstrap/Navbar';
import Alert from 'react-bootstrap/Alert';

/* Reactchartjs stuff */
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
     } from 'chart.js';

import { Bar } from 'react-chartjs-2';

/* Main app */
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
                <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                    <Container>
                        <Stack gap={5}>
                            <Navbar.Brand href="#home"><h1>Dog of the Hour</h1></Navbar.Brand>
                        </Stack>
                    </Container>
                </Navbar>
                <Container className="pt-3">
                    <Stack gap={5}>
                        <Row>
                            <section className="current-dog">
                                <CurrentDog data={this.state.allData.current_dog} />
                            </section>
                        </Row>
                        <Row>
                            <section>
                                <TodaysDogs data={this.state.allData.todays_dogs} />
                            </section>
                        </Row>
                        <Row>
                            <section className="monthly">
                                <Monthly data={this.state.allData.monthly} />
                            </section>
                        </Row>
                        <Row>
                            <section className="leaderboard">
                                <RunsLeaderboard data={this.state.allData.runs_by_month} />
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
    if (data) {
        return (
        <>
        <BsTable tableData={data.table} title='Monthly Standings' />
        <ChartJSBar data={data.chart} />
        </>
        );
    }
}

function ChartJSBar({data}) {
    if ({data}) {
        const labels = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
        ];
        const chart_data = {
            labels: labels,
            datasets: [{
                label: 'My First dataset',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 5, 2, 20, 30, 45],
                }]
        };
        
        ChartJS.register(
            CategoryScale,
            LinearScale,
            BarElement,
            Title,
            Tooltip,
            Legend
        );

        return(
            <Bar data={data} />
        );
    };
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
                <Row>
                    <Alert variant="success">{data.dogname} is Dog of the Hour!</Alert>
                    <span className="doth-current-hour">{data.date}</span>
                </Row>
            </>
        );
    }

}

function TodaysDogs({data}) {
    if (data) {
        return (
            <BsTable tableData={data.table} title={"Today's Winners"} />
        )
    }
}

function RunsLeaderboard({data}) {
    if (data) {
        return (
            <>
            <BsTable tableData={data.table} title={'Runs Leaderboard'} />
            <ChartJSBar data={data.chart} />
            </>
        )
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<DothDashboard />);

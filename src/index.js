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

/* Plotly */
import Plot from 'react-plotly.js'

/* URL for API requests */

const apiUrl = 'http://127.0.0.1:5000/all-views';
//const apiUrl = '/api/all-views';

/* Main app */
class DothDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // get body data for monthly view
        axios.get(apiUrl)
        .then(res => {
            this.setState({allData: res.data});
        }).catch(error => {console.error(error)});
    }

    render() {
        if (this.state.allData) {
            return (
                <>
                <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="site-header">
                    <Container>
                        <Stack gap={5}>
                            <Navbar.Brand href="#home">
                            <h1>Dog of the Hour</h1>
                            <em>Cometh the hour, cometh the dog</em>
                            </Navbar.Brand>
                        </Stack>
                    </Container>
                </Navbar>
                <Container className="pt-5">
                    <Stack gap={3}>
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
                            <section className="yearly">
                                <Yearly data={this.state.allData.yearly} />
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
        }
        else {

            return (<h1>Loading...</h1>)
        }
    }

}

function Monthly({data}) {
    if (data) {
        const [rows, dates, dogNames] = colsToRows(data)
        const [y, x, legend] = colsToRows(data, false)
        return (
        <>
        <BsTable headings={Array.of('', ...dates)} tableData={rows} title='Monthly Standings' />
        <PlotlyBar names={legend} x={x} y={y} />
        </>
        );
    }
}

function colsToRows(cols, addIndex=true) {
    // need firstcol (index), colnames, and rows
    let dates = Object.keys(cols)
    // just need keys from one of the objects as they're all the same
    let dogNames = Object.keys(cols[dates[0]])
    // get rows from cols
    let rows = Array()
    dogNames.map(dogName => {
        // add item and get index of last item
        let last_index = rows.push(Array()) - 1
        if (addIndex) rows[last_index].push(dogName)
        dates.map(date => {
            rows[last_index].push(cols[date][dogName])
        })
    })
    return [rows, dates, dogNames]
}

function Yearly({data}) {
    if (data) {
        const [rows, dates] = colsToRows(data)
        return (
        <>
        <BsTable headings={Array.of('', ...dates)} tableData={rows} title='Yearly Standings' />
        {/*<PlotlyBar data={data} />*/}
        </>
        );
    }
}

function PlotlyBar({names, x, y}) {
    if ({names} && {x} && {y}) {
        let plot_data = Array()
        y.map((y, index) => {
            plot_data.push({x: x, y: y, name: names[index], type: 'bar'})
        })
        return(
        <Plot data={plot_data} layout={{xaxis: {type: 'category'}, range: x}} style={{width: '100%'}} />
        )
    };
}

function BsTable({tableData, headings, title}) {
    
    let headerHtml = (title === undefined ? '' : getHeaderHtml())
    function getHeaderHtml() {
        return(<h2>{title}</h2>)
    }

    let headingsHtml = (headings === undefined ? '' : tableHeadings())

    if (tableData) {
        return (
            <>
            {headerHtml}
            <Table striped bordered hover responsive>
                {headingsHtml}
                {<tbody>
                    {tableData.map(row => {
                        return (
                            <tr>{row.map(cell => {
                                return(<td>{cell}</td>)
                            }

                            )}</tr>
                            );}
                        )
                    } 
                </tbody>}
            </Table>
            </>
        )
    };
    
    function tableHeadings() {
        return(
            <>
            <thead>
                <tr>
                    {headings.map(heading => {
                    return (<th key={heading}>{heading}</th>)
                    })}
                </tr>
            </thead>
            </>
        );
    }
}

function CurrentDog({data}) {
    if (data) {
        return (
            <>
                <Row>
                    <Col md="auto">
                        <Alert variant="success"><strong>{data.dogname} is Dog of the Hour!</strong></Alert>
                    </Col>
                </Row>
            </>
        );
    }

}

function TodaysDogs({data}) {
    if (data) {
        return (
            <BsTable tableData={Array.of(Object.values(data.dogname))} headings={Object.values(data.hour)} title={"Today's Winners"} />
        )
    }
}

function RunsLeaderboard({data}) {
    if (data) {
        const [rows, dates] = colsToRows(data)
        return (
            <>
            <BsTable headings={Array.of('', ...dates)} tableData={rows} title={'Runs Leaderboard'} />
            {/*<PlotlyBar data={data} />*/}
            </>
        )
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<DothDashboard />);

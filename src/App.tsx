import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

import { Container, Row, Col } from 'react-bootstrap'

interface State {
  tarhelyek: Tarhely[];
  regNev: string;
  regMeret: number;
  regAr: number;
}

interface Tarhely {
  id: number;
  nev: string;
}

interface TarhelyListResponse {
  tarhelyek: Tarhely[];
}

class App extends Component <{}, State>{

  constructor(props: {}) {
    super(props);

    this.state = {
      regNev: '',
      regMeret: 0,
      regAr: 0,
      tarhelyek: [],
    }
  }

  async loadTarhelyek() {
    let response = await fetch('http://localhost:3000/api/tarhely');
    let data = await response.json() as TarhelyListResponse;
    this.setState({
      tarhelyek: data.tarhelyek,
    })
  }

  componentDidMount() {
    this.loadTarhelyek();
  }

  handleRegister = async () => {
    const { regNev, regMeret, regAr } = this.state;
    if (regNev.trim() == '' || regMeret < 0 || regAr < 0) {
      return;
    }

    const adat = {
      nev: regNev,
      meret: regMeret,
      ar: regAr,
    };

    let response = await fetch('http://localhost:3000/api/tarhely', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adat),
    });

    this.setState({
      regNev: '',
      regMeret: 0,
      regAr: 0,
    })

    await this.loadTarhelyek();

  }

  render() {
    const { regNev, regMeret, regAr } = this.state;

    return <Container>
      <Row>
      <Col md><h2>Új tárhely</h2></Col>
      </Row>
      <Row id='form'>
      <Col md>Név: <input type='text' value={regNev} onChange={e => this.setState({ regNev: e.currentTarget.value })} /><br /></Col>
      <Col md>Méret: <input type='number' value={regMeret} onChange={e => this.setState({ regMeret: parseInt(e.currentTarget.value) })} /><br /></Col>
      <Col md>Ár: <input type='number' value={regAr} onChange={e => this.setState({ regAr: parseInt(e.currentTarget.value) })} /><br /></Col>
      </Row>
      <Row id='gomb'>
      <Col md><button onClick={this.handleRegister}>Felvétel</button></Col>
      </Row>
      <Row>
      <Col md><h2>Tárhelyek listája</h2></Col>
      </Row>
      <Row id='lista'>
      <Col md><ul>
        {
          this.state.tarhelyek.map(tarhely => <li>{tarhely.nev}</li>)
        }
      </ul></Col>
      </Row>
    </Container>
  }
}

export default App;

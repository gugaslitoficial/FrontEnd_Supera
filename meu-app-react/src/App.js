import React, { useEffect, useState } from 'react';
import './App.css';
import moment from 'moment';
import api from './api/api';

function App() {
  const [data, setData] = useState([]);
  const [dataInicioFiltro, setDataInicioFiltro] = useState('');
  const [dataFimFiltro, setDataFimFiltro] = useState('');
  const [nomeOperador, setNomeOperador] = useState('');

  useEffect(() => {
    api.get("/transferencias").then((response) => {
      setData(response.data)
    }).catch((error) => { console.log(error) })
  }, []);

  const handleDataInicioFiltroChange = (event) => {
    setDataInicioFiltro(event.target.value);
  };

  const handleDataFimFiltroChange = (event) => {
    setDataFimFiltro(event.target.value);
  };

  const handleNomeOperadorChange = (event) => {
    setNomeOperador(event.target.value);
  };

  const handleSearch = () => {
    let newData = [];

    if (dataInicioFiltro) {
      data.map((item) => {
        var dateFormated = new Date(item.dataTransferencia);
        if (dataInicioFiltro <= dateFormated.toISOString().substring(0, 10)) {
          newData.push(item);
        }
      });
    }

    if (dataFimFiltro) {
      if (newData.length === 0) {
        data.map((item) => {
          var dateFormated = new Date(item.dataTransferencia);
          if (dataFimFiltro >= dateFormated.toISOString().substring(0, 10)) {
            newData.push(item);
          }
        });
      } else {
        let dataFilter = []
        newData.map(
          (item) => {
            var dateFormated = new Date(item.dataTransferencia);
            if (dataFimFiltro >= dateFormated.toISOString().substring(0, 10)) {
              dataFilter.push(item);
            }
          }
        )
        newData = dataFilter;
      }
    }

    if (nomeOperador) {
      if (newData.length === 0) {
        data.map(
          (item) => {
            if (nomeOperador === item.conta.nomeResponsavel) {
              newData.push(item);
            }
          }
        );
      } else {
        let dataFilter = [];
        newData.map(
          (item) => {
            if (nomeOperador === item.conta.nomeResponsavel) {
              dataFilter.push(item);
            }
          }
        )
        newData = dataFilter;
      }
    }

    if (newData.length !== 0) {
      setData(newData)
    }
  }

  const handleClear = () => {
    api.get("/transferencias").then((response) => {
      setData(response.data)
      setNomeOperador('')
      setDataInicioFiltro('')
      setDataFimFiltro('')
    }).catch((error) => { console.log(error) })
  }

  return (
    <div className="App">
      <div className="div_principal_pesquisa">
        <div>
          <label htmlFor="date">Data de Início:</label>
          <input type="date" value={dataInicioFiltro} onChange={handleDataInicioFiltroChange} />
        </div>
        <div>
          <label htmlFor="date">Data de Fim:</label>
          <input placeholder='PUTAQUEPARuyu' type="date" value={dataFimFiltro} onChange={handleDataFimFiltroChange} />
        </div>
        <div>
          <input
            placeholder='Nome do Operador'
            type="text"
            name="nome"
            id="nome"
            className="pesquisa_nome_operador"
            value={nomeOperador}
            onChange={handleNomeOperadorChange}
          />
        </div>
        <div className="buttons-search">
          <button
            className='button-clear'
            onClick={() => handleClear()}
          >
            LIMPAR
          </button>
          <button
            className='button-search'
            onClick={() => handleSearch()}
          >
            PESQUISAR
          </button>
        </div>
      </div>
      <div>
        <div className="div_principal_tabela">
          <div className='linha-superior'>
            <span>Saldo total: R$ 50,00 </span>
            <span>Saldo no período: R$ 50,00 </span>
          </div>
          <table id="tabela_transacoes">
            <thead>
              <tr className='th-divisor'>
                <th>Dados</th>
                <th>Valencia</th>
                <th>Tipo</th>
                <th>Nome do Operador</th>
              </tr>
            </thead>
            <tbody>
              {data.map((transferencia) => (
                <tr key={transferencia.id}>
                  <td>{moment(transferencia.dataTransferencia).format('DD/MM/YYYY')}</td>
                  <td>{transferencia.valor}</td>
                  <td>{transferencia.tipo}</td>
                  <td>{transferencia.conta.nomeResponsavel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;

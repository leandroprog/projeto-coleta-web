import React, { useCallback, useEffect, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, Marker, TileLayer } from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';

import "./styles.css";

import logo from "../../assets/logo.svg";

interface IItems {
  id: number;
  title: string;
  image_url: string;
}
interface IUf {
  id: number;
  sigla: string;
  nome: string;
}

interface IMunicipios {
  id: number;
  nome: string;
}

interface IIBGEMunicipiosResponse {
  id: number;
  nome: string;
}


const CreatePoint = () => {

  const [items, setItems] = useState<IItems[]>([]);
  const [ufs, setUfs] = useState<IUf[]>([]);
  const [municipios, setMunicipios] = useState<IMunicipios[]>([]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedMunicipio, setSelectedMunicipio] = useState('0');

  useEffect( () => {
      api.get('/items').then(result => {
        setItems(result.data)
      });
  }, []);

  useEffect( () => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(result => {
      setUfs(result.data)
    });
}, []);


  useEffect( () => {
    if(selectedUf === '0') return;

    axios.get<IIBGEMunicipiosResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(result => {

    const municipios = result.data.map(items => ({
      id: items.id,
      nome: items.nome
    }))
      
      setMunicipios(municipios)
    });
  }, [selectedUf]);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;  
    setSelectedUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const minicipio = event.target.value;      
    setSelectedMunicipio(minicipio)
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>
      <form>
        <h1>
          Cadastro do
          <br /> ponto de coleta
        </h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
            //   onChange={handleInputChange}
              type="text"
              name="name"
              id="name"
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                // onChange={handleInputChange}
                type="text"
                name="email"
                id="email"
              />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                // onChange={handleInputChange}
                type="text"
                name="whatsapp"
                id="whatsapp"
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={[-22.8559305,-43.3125786]} zoom={15} >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[-22.8535202,-43.3090162]} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>

              <select  name="uf" value={selectedUf} onChange={handleSelectUf}  id="uf">
                <option value="0">Selecione uma UF</option>
                {ufs?.map(uf => (
                  <option key={uf.nome} value={uf.sigla}>
                    {uf.sigla}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="municipio">Cidade</label>
              <select name="municipio" value={selectedMunicipio} onChange={handleSelectCity} id="municipio">
                <option value="0">Selecione uma cidade</option>

                {municipios.map(item => (
                  <option key={item.nome} value={item.nome}>
                    {item.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>


          <ul className="items-grid">
            {items.map(item => (
              <li
                key={item.id}
                // onClick={() => handleSelectItem(item.id)}
                // className={selectedItems.includes(item.id) ? 'selected' : ''}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar novo ponto de coleta</button>
      </form>
    </div>
  );
};
export default CreatePoint;

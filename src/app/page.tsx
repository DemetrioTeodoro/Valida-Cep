"use client";

import React, { useCallback, useState } from "react";

import { saveToJsonFile } from "./utils/saveJsonFile";
import { Address } from "./interfaces";

import styles from "./page.module.css";

const emptyAddress = {
  cep: "",
  logradouro: "",
  complemento: "",
  unidade: "",
  bairro: "",
  localidade: "",
  uf: "",
  estado: "",
  regiao: "",
  ibge: "",
  gia: "",
  ddd: "",
  siafi: ""
}

export default function Home() {

  const [address, setAddress] = useState<Address>(emptyAddress);

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, cep: event.target.value })
  }, [address]);

  const validateZipCode = (cep: string): boolean => {
    try {
      const trimmedCep = cep.trim();
      if (trimmedCep === "" || isNaN(Number(trimmedCep))) {
        return false;
      }
      if (trimmedCep.length !== 8) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSearchCep = useCallback(async () => {
    const isZipCode = validateZipCode(address.cep);
    if (!isZipCode) {
      alert("Digite um cep válido, por favor!")
      return
    }

    const response = await fetch(`https://viacep.com.br/ws/${address.cep}/json/`)
    if (response.status === 200) {
      const addressByViaCep = await response.json()
      setAddress(addressByViaCep)
    } else {
      alert("Ocorreu um erro, tente novamente!")
    }
  }, [address.cep]);

  const emptyFields = useCallback(() => {
    setAddress(emptyAddress)
  }, [emptyAddress]);

  const saveFields = useCallback(() => {
    saveToJsonFile(address)
  }, [address]);

  return (
    <div className={styles.page}>
      <label>Digite seu cep:</label>
      <input type="text" value={address.cep} maxLength={8} onChange={onChange} onBlur={handleSearchCep} className={styles.addressInputs} />

      <label>Logradouro:</label>
      <input type="text" value={address.logradouro} readOnly className={styles.addressInputs} />

      <label>Complemento:</label>
      <input type="text" value={address.complemento} readOnly className={styles.addressInputs} />

      <label>Bairro:</label>
      <input type="text" value={address.bairro} readOnly className={styles.addressInputs} />

      <label>Cidade:</label>
      <input type="text" value={address.localidade} readOnly className={styles.addressInputs} />

      <label>Estado:</label>
      <input type="text" value={address.estado} readOnly className={styles.addressInputs} />

      <button onClick={emptyFields} className={styles.addressButtons}>Limpar</button>
      <button onClick={saveFields} className={styles.addressSaveButtons}>Salvar</button>
    </div>
  );
}

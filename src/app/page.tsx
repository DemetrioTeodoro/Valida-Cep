"use client";

import React, { useCallback, useState } from "react";

import { Button, Card, CardBody, CardFooter, CardHeader, CardText, CardTitle, Form, FormFeedback, FormGroup, Input, Label } from "reactstrap";

import { validateZipCode } from "./utils/validateZipCode";
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
  const [isZipCodeInValid, setIsZipCodeInValid] = useState<boolean>(false);

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, cep: event.target.value })
  }, [address]);

  const handleSearchCep = useCallback(async () => {
    const isZipCode = validateZipCode(address.cep);
    if (!isZipCode) {
      setIsZipCodeInValid(true);
      return
    }

    setIsZipCodeInValid(false);
    const response = await fetch(`https://viacep.com.br/ws/${address.cep}/json/`)
    if (response.status === 200) {
      const addressByViaCep = await response.json()
      setAddress(addressByViaCep)
    } else {
      alert("Ocorreu um erro, tente novamente!")
    }
  }, [address.cep]);

  const emptyFields = useCallback(() => {
    setIsZipCodeInValid(false);
    setAddress(emptyAddress)
  }, [emptyAddress]);

  const saveFields = useCallback(() => {
    saveToJsonFile(address)
  }, [address]);

  return (
    <div className={styles.page}>
      <Form>
        <Card>
          <CardHeader>
            <FormGroup>
              <Label for="zipCode">Cep:</Label>
              <Input invalid={isZipCodeInValid} type="text" name="zipCode" id="zipCode" placeholder="Exemplo: 00000000" value={address.cep} maxLength={8} onChange={onChange} onBlur={handleSearchCep} />
              {isZipCodeInValid && <FormFeedback>Ocorreu algo errado, digite o cep novamente</FormFeedback>}
            </FormGroup>
          </CardHeader>

          <CardBody>
            <CardTitle tag="h5">Informações de busca do Endereço</CardTitle>

            <FormGroup>
              <Label for="street">Logradouro:</Label>
              <Input type="text" name="street" id="street" placeholder="Logradouro será preenchido" value={address.logradouro} readOnly />
            </FormGroup>

            <FormGroup>
              <Label for="complement">Complemento:</Label>
              <Input type="text" name="complement" id="complement" placeholder="Complemento será preenchido" value={address.complemento} readOnly />
            </FormGroup>

            <FormGroup>
              <Label for="neighborhood">Bairro:</Label>
              <Input type="text" name="neighborhood" id="neighborhood" placeholder="Bairro será preenchido" value={address.bairro} readOnly />
            </FormGroup>

            <FormGroup>
              <Label for="city">Cidade:</Label>
              <Input type="text" name="city" id="city" placeholder="Cidade será preenchido" value={address.localidade} readOnly />
            </FormGroup>

            <FormGroup>
              <Label for="state">Estado:</Label>
              <Input type="text" name="state" id="state" placeholder="Estado será preenchido" value={address.estado} readOnly />
            </FormGroup>

          </CardBody>

          <CardFooter>
            <Button color="secondary" onClick={emptyFields}>Limpar</Button>{' '}
            <Button color="success" onClick={saveFields}>Salvar</Button>
          </CardFooter>

        </Card>
      </Form>

    </div>
  );
}

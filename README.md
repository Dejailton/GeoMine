Aplicação GeoMine:

Este projeto tem como intuito criar um gerenciador de minas, com relatórios sobre a produção diária ou mensal.

Abaixo há a descrição das rotas disponíveis para a aplicação

#### **1. Listar todas as produções**
- **Método:** `GET`
- **Endpoint:** `/producoes`
- **Descrição:** Retorna uma lista de todas as produções cadastradas.
- **Exemplo de Resposta (200 OK):**
    ```json
    [
        {
            "id": 1,
            "data": "2026-01-20",
            "quantidade": 1000,
            "unidadeMedida": "toneladas",
            "geoMineId": 5
        },
        {
            "id": 2,
            "data": "2026-01-19",
            "quantidade": 2000,
            "unidadeMedida": "toneladas",
            "geoMineId": 10
        }
    ]
    ```

---

#### **2. Buscar produção por ID**
- **Método:** `GET`
- **Endpoint:** `/producoes/{id}`
- **Descrição:** Retorna as informações da produção com o ID especificado.
- **Parâmetros:**
    - `id` (Path Variable): ID da produção.
- **Exemplo de Resposta (200 OK):**
    ```json
    {
        "id": 1,
        "data": "2026-01-20",
        "quantidade": 1000,
        "unidadeMedida": "toneladas",
        "geoMineId": 5
    }
    ```
- **Exemplo de Resposta (404 Not Found):**
    ```json
    {
        "message": "Produção não encontrada."
    }
    ```

---

#### **3. Criar uma nova produção**
- **Método:** `POST`
- **Endpoint:** `/producoes`
- **Descrição:** Cria uma nova produção.
- **Corpo da Requisição:**
    ```json
    {
        "data": "2026-01-20",
        "quantidade": 1500,
        "unidadeMedida": "toneladas",
        "geoMineId": 5
    }
    ```
- **Exemplo de Resposta (201 Created):**
    ```json
    {
        "id": 3,
        "data": "2026-01-20",
        "quantidade": 1500,
        "unidadeMedida": "toneladas",
        "geoMineId": 5
    }
    ```

---

#### **4. Atualizar uma produção existente**
- **Método:** `PUT`
- **Endpoint:** `/producoes/{id}`
- **Descrição:** Atualiza as informações de uma produção existente com base no ID especificado.
- **Parâmetros:**
    - `id` (Path Variable): ID da produção.
- **Corpo da Requisição:**
    ```json
    {
        "data": "2026-01-21",
        "quantidade": 1800,
        "unidadeMedida": "toneladas",
        "geoMineId": 5
    }
    ```
- **Exemplo de Resposta (200 OK):**
    ```json
    {
        "id": 3,
        "data": "2026-01-21",
        "quantidade": 1800,
        "unidadeMedida": "toneladas",
        "geoMineId": 5
    }
    ```

---

#### **5. Deletar uma produção**
- **Método:** `DELETE`
- **Endpoint:** `/producoes/{id}`
- **Descrição:** Remove a produção com o ID especificado.
- **Parâmetros:**
    - `id` (Path Variable): ID da produção.
- **Exemplo de Resposta (204 No Content):**
    ```
    Produção deletada com sucesso.
    ```

---

## **Rotas do GeoMineController**

### **Base URL:** `/minas`

#### **1. Listar todas as mineradoras**
- **Método:** `GET`
- **Endpoint:** `/minas`
- **Descrição:** Retorna uma lista de todas as mineradoras cadastradas.
- **Exemplo de Resposta (200 OK):**
    ```json
    [
        {
            "id": 1,
            "nome": "Mina de Ouro",
            "localizacao": "Brasil",
            "mineral": "Ouro",
            "ativa": true
        },
        {
            "id": 2,
            "nome": "Mina de Prata",
            "localizacao": "Chile",
            "mineral": "Prata",
            "ativa": false
        }
    ]
    ```

---

#### **2. Buscar mineradora por ID**
- **Método:** `GET`
- **Endpoint:** `/minas/{id}`
- **Descrição:** Retorna as informações da mineradora com o ID especificado.
- **Parâmetros:**
    - `id` (Path Variable): ID da mineradora.
- **Exemplo de Resposta (200 OK):**
    ```json
    {
        "id": 1,
        "nome": "Mina de Ouro",
        "localizacao": "Brasil",
        "mineral": "Ouro",
        "ativa": true
    }
    ```
- **Exemplo de Resposta (404 Not Found):**
    ```json
    {
        "message": "Mineradora não encontrada."
    }
    ```

---

#### **3. Criar uma nova mineradora**
- **Método:** `POST`
- **Endpoint:** `/minas`
- **Descrição:** Cria uma nova mineradora.
- **Corpo da Requisição:**
    ```json
    {
        "nome": "Mina de Diamantes",
        "localizacao": "África do Sul",
        "mineral": "Diamantes",
        "ativa": true
    }
    ```
- **Exemplo de Resposta (201 Created):**
    ```json
    {
        "id": 3,
        "nome": "Mina de Diamantes",
        "localizacao": "África do Sul",
        "mineral": "Diamantes",
        "ativa": true
    }
    ```

---

#### **4. Atualizar uma mineradora existente**
- **Método:** `PUT`
- **Endpoint:** `/minas/{id}`
- **Descrição:** Atualiza as informações de uma mineradora existente com base no ID especificado.
- **Parâmetros:**
    - `id` (Path Variable): ID da mineradora.
- **Corpo da Requisição:**
    ```json
    {
        "nome": "Mina de Platina",
        "localizacao": "África do Sul",
        "mineral": "Platina",
        "ativa": true
    }
    ```
- **Exemplo de Resposta (200 OK):**
    ```json
    {
        "id": 3,
        "nome": "Mina de Platina",
        "localizacao": "África do Sul",
        "mineral": "Platina",
        "ativa": true
    }
    ```

---

#### **5. Deletar uma mineradora**
- **Método:** `DELETE`
- **Endpoint:** `/minas/{id}`
- **Descrição:** Remove a mineradora com o ID especificado.
- **Parâmetros:**
    - `id` (Path Variable): ID da mineradora.
- **Exemplo de Resposta (204 No Content):**
    ```
    Mineradora deletada com sucesso.
    ```

---
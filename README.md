# GeoMine

Aplicação para gerenciar minas e suas produções.

Este repositório contém uma API em Java (Spring Boot) com um front-end estático (HTML/JS/CSS) em `src/main/resources/static`.

Resumo rápido
- Porta padrão: 5000 (configurada em `src/main/resources/application.properties`).
- Conexão com banco via variáveis de ambiente (PostgreSQL).

Tecnologias
- Java 17+
- Spring Boot
- Maven
- PostgreSQL
- Front-end: HTML, JavaScript, CSS (arquivos estáticos em `src/main/resources/static`)

Pré-requisitos
- JDK 17 oder superior
- Maven 3.6+
- PostgreSQL (opcional para testes rápidos — a aplicação espera variáveis de ambiente para conexão)

Configuração (variáveis de ambiente)
A aplicação lê a configuração do datasource a partir das variáveis abaixo (usadas em `application.properties`):
- DB_HOST — host do PostgreSQL (ex: localhost)
- DB_PORT — porta do PostgreSQL (ex: 5432)
- DB_NAME — nome do banco
- DB_USER — usuário do banco
- DB_PASSWORD — senha do banco

Exemplo (PowerShell):

```powershell
$env:DB_HOST = "localhost";
$env:DB_PORT = "5432";
$env:DB_NAME = "geomine_db";
$env:DB_USER = "usuario";
$env:DB_PASSWORD = "senha";
mvn spring-boot:run
```

Como executar
1. Defina as variáveis de ambiente (ou altere `src/main/resources/application.properties` diretamente para uso local).
2. Com Maven instalado, rode no diretório do projeto:

```powershell
mvn spring-boot:run
```

Ou gerar JAR e executar:

```powershell
mvn clean package
java -jar target/GeoMine-0.0.1-SNAPSHOT.jar
```

Front-end
Os arquivos do front-end ficam em `src/main/resources/static` e são servidos automaticamente pelo Spring Boot. Abra `http://localhost:5000` no navegador para acessar a interface (index.html).

Endpoints principais
Observação: os nomes e paths abaixo refletem as controllers do projeto (ver `src/main/java/com/deloitte/GeoMine/controller`).

Minas (`GeoMineController`)
- GET /minas — listar todas as minas
- GET /minas/{id} — buscar mina por id
- POST /minas — criar nova mina (envie um `GeoMineDTO` com os campos da mina)
- PUT /minas/{id} — atualizar mina
- DELETE /minas/{id} — deletar mina (produções são removidas em cascade)

Produções (`ProducaoController`)
- GET /producoes — listar todas as produções
- GET /producoes/{id} — buscar produção por id
- POST /producoes — criar produção (use `ProducaoDTO`, informe `geoMineId`)
- PUT /producoes/{id} — atualizar produção
- DELETE /producoes/{id} — deletar produção

Exemplos de requisição (curl)
```bash
# Listar minas
curl http://localhost:5000/minas

# Criar mina
curl -X POST http://localhost:5000/minas -H "Content-Type: application/json" -d '{"nome":"Mina A","localizacao":"Brasil","mineral":"Ouro","ativa":true}'

# Criar produção
curl -X POST http://localhost:5000/producoes -H "Content-Type: application/json" -d '{"data":"2026-01-20","quantidade":1000,"unidadeMedida":"TON","valorTotal":50000.0,"geoMineId":1}'
```

Estrutura do projeto (resumida)
- src/main/java/com/deloitte/GeoMine
  - controller/ — controladores REST
  - service/ — regras de negócio
  - repository/ — acesso a dados (Spring Data)
  - dto/ — objetos de transferência
  - model/ — entidades
- src/main/resources/static — front-end estático (index.html, script.js, style.css)

Rodando testes
Execute os testes (se houver) com:

```powershell
mvn test
```

Dicas de desenvolvimento
- Altere `server.port` em `application.properties` caso precise usar outra porta.

Troubleshooting comum
- Erro de conexão com DB: verifique se o PostgreSQL está ativo, se as variáveis de ambiente estão corretas e se o usuário tem permissões.
- Porta 5000 em uso: altere `server.port` ou pare o processo que está usando a porta.

---

© 2026 Dejailton da Silva. Todos os direitos reservados.

const cors = require('cors')
const express = require("express");

const app = express();

app.use(express.json());
app.use(cors())

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json(); // Para respostas em JSON
    return data;
  } catch (error) {
    console.error('Erro ao fazer a requisição:', error.message);
    throw error; // Lança o erro para ser tratado pelo chamador
  }
}

// Exemplo de uso:
const goo = async (first) => {
  console.log({first})
  const url = first;
  const options = {
    method: 'GET', // ou 'POST', 'PUT', etc.
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const data = await makeRequest(url, options);
    return JSON.stringify(data?.data?.items || []);
  } catch (error) {
    console.error('Error:', error.message);
    return '[]'
  }
};

app.post("/use", async (req, res) => {
  console.log(req?.body)
  const items = await goo('http://localhost:3001/api/media-templates/' + (req?.body?.inputsData?.templateId || ''))
  console.log({items})

  res.json({
    items: items || '[]'
  })
});

app.listen(3050, () => {
    console.log("server started on port 3050");
});

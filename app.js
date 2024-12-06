require('dotenv').config()
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

  req?.body?.inputsData?.data

  const data = req?.body?.inputsData?.data || '{}'
  console.log({data})
  const isItemsString = typeof data === 'string'
  console.log({isItemsString})
  const payload = isItemsString ? JSON.parse(data) : data
  console.log({payload})
  console.log('process.env🚀', process.env)


  console.log(req?.body)
  const items = await goo(`${process.env.RUGG_API_URL}/media-templates/${(req?.body?.inputsData?.templateid || '')}`)
  console.log({items})

  const final = (JSON.parse(items) || [])?.map((item) => {
    if(payload[item.id]) {
      return {
        ...item,
        data: {
          ...item.data,
          content: payload[item.id]
        }
      }
    } else {
      return item
    }
  })
  console.log({final})

  res.json({
    items: JSON.stringify(final) || '[]'
  })
});

app.listen(3050, () => {
    console.log("server started on port 3050");
});

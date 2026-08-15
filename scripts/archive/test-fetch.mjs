import fetch from 'node-fetch';

const token = "sk4KYFEAvSk0qWojDRdnzIRWMWl9olb3E6hm2oGFffHzqtAeawekhnEYbg8v9Gur5uHZQ0JuKNCVilI7unFS8Nc6VwOWYlrR3DifkVYguHqMJnznZptGtFWIenRt5zoxzWpVpUhK8TcuMfl9vDRlyHyaK4BBbEE4aGR1o6tJFmNQOnF2lrT7";
const projectId = "ruuprk8g";
const dataset = "production";

const url = `https://${projectId}.api.sanity.io/v2023-05-03/data/mutate/${dataset}?returnIds=true`;

const body = {
  mutations: [
    {
      createOrReplace: {
        _id: "test-doc-123",
        _type: "post",
        title: "Test API Fetch"
      }
    }
  ]
};

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(body)
})
.then(res => res.text().then(text => console.log('Status:', res.status, 'Response:', text)))
.catch(err => console.error(err));

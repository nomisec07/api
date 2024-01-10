const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const randomUserAgent = require('random-useragent');

const app = express();
const port = 3000;

const validApiKey = "nomi-Kxc5m";
const baseUrl = 'https://siterankdata.com';


const checkApiKey = (req, res, next) => {
  const apikey = req.query.apikey;
  if (apikey !== validApiKey) return res.status(401).json({ error: 'Where Is your Apikey? buy on telegram @no4meee' });
  next();
};

const isValidIP = (ip) => {
  const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  return ipPattern.test(ip);
};

app.use(checkApiKey);

app.get('/api/seo/site-checker', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required.' });
    }

    const postData = `links%5B%5D=${url}&url=0&domain=0&tool_id=1&parent_id=1`;
    const userAgent =
      'Mozilla/5.0 (Linux; Android 12; SM-A217F Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/118.0.0.0 Mobile Safari/537.36';

    const response = await axios.post('https://onetoolbox.co/checkDA_new.php', postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': userAgent,
      },
    });

    const data = response.data;
    const matches = data.match(/<td><a href="(.+?)" target="_blank">(.+?)<\/a><\/td><td class="da_data">(.+?)<\/td><td>(.+?)<\/td><td class="dr_data premium_data_container">(.+?)<\/td><td class="spam_score_data">(.+?)<\/td><td class="spam_score_data">(.+?)<\/td>/g);

    if (matches) {
      const results = matches.map(match => {
        const [, link, webPage, domainAuthority, pageAuthority, backlinks, spamScore, domainRating] =
          match.match(
            /<td><a href="(.+?)" target="_blank">(.+?)<\/a><\/td><td class="da_data">(.+?)<\/td><td>(.+?)<\/td><td class="dr_data premium_data_container">(.+?)<\/td><td class="spam_score_data">(.+?)<\/td><td class="spam_score_data">(.+?)<\/td>/
          );

        return {
          author: 'nomisec07-tech',
          webPage,
          domainAuthority,
          pageAuthority,
          backlinks,
          spamScore,
          domainRating,
        };
      });

      res.json({ results });
    } else {
      res.json({ message: 'No data found.' });
    }
  } catch (error) {
    console.error('Error making POST request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/v2/checker', (req, res) => {
  const { url } = req.body;
  const postData = `links%5B%5D=${url}&url=0&domain=0&tool_id=1&parent_id=1`;
  const userAgent =
    'Mozilla/5.0 (Linux; Android 12; SM-A217F Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/118.0.0.0 Mobile Safari/537.36';

  axios
    .post('https://onetoolbox.co/checkDA_new.php', postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': userAgent,
      },
    })
    .then(response => {
      const data = response.data;

      const matches = data.match(
        /<td><a href="(.+?)" target="_blank">(.+?)<\/a><\/td><td class="da_data">(.+?)<\/td><td>(.+?)<\/td><td class="dr_data premium_data_container">(.+?)<\/td><td class="spam_score_data">(.+?)<\/td><td class="spam_score_data">(.+?)<\/td>/g
      );

      if (matches) {
        const results = matches.map(match => {
          const [, link, webPage, domainAuthority, pageAuthority, backlinks, spamScore, domainRating] = match.match(
            /<td><a href="(.+?)" target="_blank">(.+?)<\/a><\/td><td class="da_data">(.+?)<\/td><td>(.+?)<\/td><td class="dr_data premium_data_container">(.+?)<\/td><td class="spam_score_data">(.+?)<\/td><td class="spam_score_data">(.+?)<\/td>/
          );

          return {
            webPage,
            domainAuthority,
            pageAuthority,
            backlinks,
            spamScore,
            domainRating,
          };
        });

        res.json({ results });
      } else {
        res.json({ error: 'No data found.' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Error making POST request', details: error.message });
    });
});



app.get('/api/v2/proxy', async (req, res) => {
  try {
    // Mendapatkan User-Agent palsu secara acak
    const userAgent = randomUserAgent.getRandom();

    // Konfigurasi untuk permintaan dengan User-Agent palsu
    const axiosConfig = {
      headers: {
        'User-Agent': userAgent,
      },
    };

    const response = await axios.get('https://www.proxydocker.com/en/proxylist/api?email=nomi-998@gmail.com&country=all&city=all&port=all&type=all&anonymity=all&state=all&need=all&format=json', axiosConfig);
    const data = response.data;

    // Ambil seluruh proxy yang diberikan oleh layanan pihak ketiga
    const proxies = data.Proxies.map(proxy => `${proxy.ip}:${proxy.port}`);

    // Format data yang akan dikembalikan
    const result = {
      author: "NomiSec07",
      proxies: proxies
    };

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil data proxy dari pihak ketiga' });
  }
});

app.get('/api/check-da-pa', (req, res) => {
  const { url } = req.query;

  const targetURL = 'https://www.omy.my.id:443/result.php';
  const postData = `url_form=${url}`;
  const origin = 'https://www.omy.my.id';
  const userAgent =
    'Mozilla/5.0 (Windows NT 10.0; Windows; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36';

  const headers = {
    'Origin': origin,
    'User-Agent': userAgent,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': 'PHPSESSID=d441f5b47126a0389a6004d6db446363; _ga=GA1.3.289227792.1695951868; _gid=GA1.3.925846023.1696148192; _gat=1; __gads=ID=c454f6e4d01302ea-22dbb8e131e40037:T=1695951865:RT=1696148192:S=ALNI_MbVgpqjgsK-rCD41HMGKSu9Bq9Vkw; __gpi=UID=00000c5510de28d1:T=1695951865:RT=1696148192:S=ALNI_MYmsVZbnClSCdkg23dHPDcv-ob6JQ'
  };

  axios.post(targetURL, postData, { headers })
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      const targetRow = $(`tr:contains('${url}')`);
      const cells = targetRow.find("td");
      const DA = cells.eq(2).text();
      const PA = cells.eq(3).text();

      const result = {
        Author: 'NomiSec07',
        URL: url,
        DA: DA,
        PA: PA,
      };

      res.json(result);
    })
    .catch(error => {
      res.status(500).json({ error: 'Gagal mengambil data' });
    });
});

app.get('/api/v2/reverseip', async (req, res) => {
  const ip = req.query.ip;

  if (!ip) {
    return res.status(400).json({ error: "Parameter 'ip' tidak ditemukan." });
  }

  try {
    // Lakukan request ke API eksternal menggunakan Axios
    const response = await axios.get(`https://api.webscan.cc/?action=query&ip=${ip}`);

    if (response.status === 200) {
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        const resultDomains = data.map(item => item.domain);

        // Siapkan respons API Anda dengan semua domain
        const apiResponse = {
          Author: "NomiSec07",
          domains: resultDomains
        };

        return res.status(200).json(apiResponse);
      } else {
        return res.status(404).json({ error: "Data tidak ditemukan." });
      }
    } else {
      return res.status(404).json({ error: "Data tidak ditemukan." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Gagal mengambil data dari API eksternal." });
  }
});

app.get('/api/by-date', async (req, res) => {
  try {
    const { date, startpage, endpage } = req.query;
    const domains = [];

   
    const cookies = '_ga=GA1.1.1016468513.1700634769; gads=ID=2000aea0af223f38:T=1700634768:RT=1700635362:S=ALNI_MYyUAhEoE17D1mplQPEtRczv0rl5A; gpi=UID=00000c93efd64b89:T=1700634768:RT=1700635362:S=ALNI_Mbuq5y41lV1Nh10pY2Ryclvyg1XgA; _ga_B88HRB6K31=GS1.1.1700634796.1.1.1700635400.0.0.0';

    
    for (let page = parseInt(startpage); page <= parseInt(endpage); page++) {
      const url = `https://newlyregddomains.com/${date}/${page}`;

      const config = {
        headers: {
          'Referer': `https://newlyregddomains.com/${date}/${page}`,
          'User-Agent': 'Mozilla/5.0 (Linux; Android 13; 220333QAG Build/TKQ1.221114.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/119.0.6045.67 Mobile Safari/537.36',
          'Cookie': cookies, 
        },
        withCredentials: true, 
      };

      const response = await axios.get(url, config);
      if (response.status === 200) {
        const html = response.data;
        const $ = cheerio.load(html);

        // Mengambil semua elemen <a> dalam <ul> dengan class "list"
        $('ul.list li a').each((index, element) => {
          const domain = $(element).text();
          domains.push(domain);
        });
      } else {
        console.log(`Gagal mengambil halaman web: ${url}`);
      }
    }

   
    const result = {
      Author: "NomiSec07",
      Domains: domains,
    };

    
    res.json(result);
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).json({ error: 'Terjadi kesalahan' });
  }
});

app.get('/api/subdomain_finder', async (req, res) => {
    const domain = req.query.domain;

    if (!domain) {
        return res.status(400).json({ error: 'Parameter domain is required.' });
    }

    try {
        const result = await scrapeWebsite(domain);
        if (result) {
            res.json({ author: 'nomisec07-tech', subdomains: result });
        } else {
            res.status(500).json({ error: 'Scraping failed or no subdomains found.' });
        }
    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error.' });
    }
});

async function scrapeWebsite(domain) {
    const url = 'http://rai404found.my.id/subdo-finder.php';
    const userAgent = 'Mozilla/5.0 (Linux; Android 12; SM-A217F Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/118.0.0.0 Mobile Safari/537.36';

    try {
        // Menjalankan permintaan POST dengan Axios dan menambahkan header User-Agent
        const response = await axios.post(url, { domain }, {
            headers: {
                'User-Agent': userAgent
            }
        });

        if (response.status === 200) {
            const $ = cheerio.load(response.data);

            const resultHeader = $('h2:contains("Result")');

            if (resultHeader.length > 0) {
                const resultElement = resultHeader.next('#result');
                const resultText = resultElement.text().trim();
                return resultText;
            } else {
                console.log('No subdomains found.');
                return null;
            }
        } else {
            console.log(`Failed to retrieve the page. Status code: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
        return null;
    }
}

app.get('/api/domain_to_ip', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    const response = await axios.post('http://domaintoipconverter.com/', `domains=${url}&submit=Convert`);
    const html = response.data;
    const $ = cheerio.load(html);
    const results = $('h2:contains("Your Results:") + p span').text();

    const jsonResponse = {
      Author: 'NomiSec07-Tech',
      Status: 'Success',
      Result: results
    };

    res.json(jsonResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to scrape data from the website' });
  }
});

app.get('/api/domain', async (req, res) => {
  try {
    const { page, domain, zone, isDead, country } = req.query;
    let apiUrl = `https://api.domainsdb.info/v1/domains/search?page=${page}&domain=${domain}&zone=${zone}&isDead=${isDead}`;
    if (country) apiUrl += `&country=${country}`;
    const response = await axios.get(apiUrl);
    const data = response.data;
    const filteredData = {
      author: 'NomiSec07-Tech',
      status: 'Success',
      domains: data.domains.map(item => item.domain)
    };
    res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve data from the database' });
  }
});

app.get('/api/reverse', async (req, res) => {
  const ip = req.query.ip;
  if (!ip || !isValidIP(ip)) return res.status(400).json({ error: 'Only for valid IP addresses' });

  try {
    const response = await axios.get(`https://back.spyskey.com/api/v1/public/services/all?ip=${ip}`, {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
        'sec-fetch-site': 'same-site',
        Referer: 'https://spyskey.com/',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    });

    if (response.status === 200) {
      const data = response.data;
      const result = {
        author: 'NomiSec07-tech',
        status: 'Success',
        ip: data.ip,
        total: data.total,
        domains: data.reverse.domains.map(domain => domain)
      };
      res.json(result);
    } else {
      res.status(500).json({ error: 'Failed to fetch data from the URL' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred in the request' });
  }
});

async function scrapeByExtension(extension, startPage = 1) {
  const domains = [];

  let page = startPage;

  while (true) {
    const url = `${baseUrl}/show/extension/${extension}/${page}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const foundDomains = $('div.panel-body a').map((index, element) => {
      return $(element).attr('href').substring(1);
    }).get();

    if (foundDomains.length === 0) {
      // Tidak ada lagi domain ditemukan, keluar dari loop
      break;
    }

    domains.push(...foundDomains);
    page++;
  }

  return domains;
}

app.get('/extension', async (req, res) => {
  const extension = req.query.extension;
  const startPage = req.query.startPage || 1;

  try {
    const domains = await scrapeByExtension(extension, startPage);
    res.json({ domains });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan' });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

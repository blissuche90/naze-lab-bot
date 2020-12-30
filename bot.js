const cron = require('node-cron');
const puppeteer = require('puppeteer-extra');
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const fs = require('fs');
const Sold = require('./models/Sold');
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird');
//const {installMouseHelper} = require('./extras/install_mouse_helper');
puppeteer.use(pluginStealth())



// ####################################
// ####################################
// Parameters to set

// url: url to the product page
const xboxurl = 'https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2334524.m570.l1312&_nkw=xbox+series+x&_sacat=0&LH_TitleDesc=0&_osacat=0&_odkw=ps5';//'https://www.nike.com/us/launch/t/kobe-4-protro-wizenard/';
const ps5url =  'https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2380057.m570.l1313&_nkw=ps5&_sacat=0';

	async function connectDatabase(){
		try{
			await mongoose.connect('mongodb://localhost:27017/naze-bot', {
				useUnifiedTopology: true,
				useNewUrlParser: true
			});
			var db = mongoose.connection;

			db.on("error", console.error.bind(console, "connection error:"));

			db.once("open", function() {
			console.log("Connection Successful!");
			});
		}catch(error){
			console.log(error);
		}

	}

	async function saveData(text,item){

		await connectDatabase();
	
		const SoldValue = new Sold({sellcount  : text , item : item});
		
		SoldValue.save((err,result)=>{
			if(err) console.log(err)
			//console.log(result);
			console.log('Saved');
		});	
	}
	
	// ####################################
	// ####################################
	// main flow
	async function crawl(url, item) {
		const browser = await puppeteer.launch({
			ignoreHTTPSErrors: true,
			headless: false
		});
		const page = await browser.newPage();
		await page.goto(url);
		await page.waitFor(500);
		// Scrape data
		const result = await page.evaluate(() => {
			// Scrape some selectors
			text = document.querySelector('.s-item__additionalItemHotness').innerText;
			return {
				text
			}

		
		});

		saveData(Number(result.text.split(' ')[0]), item);
		await browser.close();
	}

	async function DisplayRecords(){
		await connectDatabase();

		Sold.find({ }, function (err, sells) {
			if (err) {
			  console.log('error occured');
			}
			sells.forEach(item => {
			 console.log(`${item.sellcount} ${item.item}’s sold on ${item.updateAt}`)
		    console.log();
			});
			
		})
	}

	console.log('Bot Started .......');
	cron.schedule('41 17 * * *', async () => {
		await crawl(xboxurl, 'XBOX X');
		await crawl(ps5url,'PS 5')
		await DisplayRecords();
	});



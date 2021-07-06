
const puppeteer =require('puppeteer');
const cronJob= require('cron');
//const nodeMailer=require('nodemailer');
const notifier = require('node-notifier')
const url='https://www.amazon.in/Jackson-Safety-Shield-Protection-Goggle/dp/B01LZ7TODW/';
let price;
let page;
let job;

async function getPrice(){
    const browser=await puppeteer.launch({headless:false,args:['--start-fullscreen']});
    page=await browser.newPage();
    await page.setViewport({height:1500,width:1500});
    await page.goto(url);

    await page.waitForSelector('#priceblock_dealprice');
    price=await page.$eval('#priceblock_dealprice',(ele)=>ele.innerText);
    price=price.replace(/[^0-9.]/g,"");

    await console.log(price);
    await notifyMe(price);
    await browser.close();
}
async function monitorJob(){
   // page= await configureBrowser();
     job=new cronJob.CronJob('*/5 * * * *',async function(){
        await getPrice();
     },null,true,null,null,true);  
    job.start();

}

async function notifyMe(price){
    notifier.notify(price);
}

// async function sendMail()
// {
//     let transporter=nodeMailer.createTransport({
//         service:'gmail',
//         auth:{
//             user:'',//enter email id
//             pass:''      //enter pwd      
//         }
//     });
//    let info=await transporter.sendMail({
//        from:'',
//        to:'',
//        subject:'amazon price tracker',
//        text:price,
//    });
// }

monitorJob();
